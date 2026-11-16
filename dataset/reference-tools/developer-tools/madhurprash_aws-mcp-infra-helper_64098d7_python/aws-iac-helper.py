import os
import json
import boto3
import subprocess
from diagrams.aws.compute import EC2
from diagrams import Diagram, Cluster
from diagrams.aws.database import RDS
from mcp.server.fastmcp import FastMCP
from typing import Any, Dict, List, Optional
from diagrams.aws.network import PublicSubnet, PrivateSubnet
from diagrams.aws.network import VPC, InternetGateway, RouteTable

# Initialize FastMCP server
mcp = FastMCP("aws-iac-helper")

# Helper functions
def run_terraform_command(command: List[str], working_dir: str) -> Dict[str, Any]:
    """Run a terraform command and return the result."""
    try:
        result = subprocess.run(
            ["terraform"] + command,
            cwd=working_dir,
            capture_output=True,
            text=True,
            check=True
        )
        return {
            "success": True,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "stdout": e.stdout,
            "stderr": e.stderr,
            "error": str(e)
        }

def parse_tf_plan(plan_json: str) -> Dict[str, Any]:
    """Parse terraform plan output to a more readable format."""
    try:
        plan = json.loads(plan_json)
        
        resources_to_add = []
        resources_to_change = []
        resources_to_destroy = []
        
        for resource in plan.get("resource_changes", []):
            actions = resource.get("change", {}).get("actions", [])
            
            if "create" in actions:
                resources_to_add.append(resource["address"])
            elif "update" in actions:
                resources_to_change.append(resource["address"])
            elif "delete" in actions:
                resources_to_destroy.append(resource["address"])
        
        return {
            "add": resources_to_add,
            "change": resources_to_change,
            "destroy": resources_to_destroy,
            "has_changes": bool(resources_to_add or resources_to_change or resources_to_destroy)
        }
    except Exception as e:
        return {"error": f"Failed to parse plan: {str(e)}"}

# MCP Tools
@mcp.tool()
async def generate_terraform_template(resource_type: str, configuration: Dict[str, Any]) -> str:
    """Generate a Terraform template for the specified AWS resource.
    
    Args:
        resource_type: Type of AWS resource (e.g., 'ec2', 's3', 'rds')
        configuration: Configuration parameters for the resource
    """
    templates = {
        "ec2": """
resource "aws_instance" "{name}" {{
  ami           = "{ami}"
  instance_type = "{instance_type}"
  
  tags = {{
    Name = "{name}"
  }}
}}
""",
        "s3": """
resource "aws_s3_bucket" "{name}" {{
  bucket = "{bucket_name}"
  
  tags = {{
    Name = "{name}"
  }}
}}
""",
        "rds": """
resource "aws_db_instance" "{name}" {{
  allocated_storage    = {storage}
  db_name              = "{db_name}"
  engine               = "{engine}"
  engine_version       = "{engine_version}"
  instance_class       = "{instance_class}"
  username             = "{username}"
  password             = "{password}"
  parameter_group_name = "default.{engine}{engine_version}"
  skip_final_snapshot  = true
  
  tags = {{
    Name = "{name}"
  }}
}}
"""
    }
    
    if resource_type not in templates:
        return f"Resource type '{resource_type}' is not supported. Supported types: {', '.join(templates.keys())}"
    
    try:
        return templates[resource_type].format(**configuration)
    except KeyError as e:
        return f"Missing required configuration parameter: {e}"

@mcp.tool()
async def validate_terraform_template(template_path: str) -> str:
    """Validate a Terraform template file.
    
    Args:
        template_path: Path to the Terraform template file or directory
    """
    working_dir = os.path.dirname(template_path) if os.path.isfile(template_path) else template_path
    
    # Initialize if needed
    init_result = run_terraform_command(["init"], working_dir)
    if not init_result["success"]:
        return f"Failed to initialize Terraform: {init_result['stderr']}"
    
    # Validate
    validate_result = run_terraform_command(["validate", "-json"], working_dir)
    if not validate_result["success"]:
        return f"Validation failed: {validate_result['stderr']}"
    
    try:
        validation = json.loads(validate_result["stdout"])
        if validation.get("valid", False):
            return "Template is valid."
        else:
            diagnostics = validation.get("diagnostics", [])
            messages = [f"{d.get('severity', 'error')}: {d.get('summary', '')} - {d.get('detail', '')}" for d in diagnostics]
            return "Template validation failed:\n" + "\n".join(messages)
    except json.JSONDecodeError:
        return f"Failed to parse validation result: {validate_result['stdout']}"

@mcp.tool()
async def detect_drift(template_path: str) -> str:
    """Detect infrastructure drift compared to the Terraform state.
    
    Args:
        template_path: Path to the Terraform template file or directory
    """
    working_dir = os.path.dirname(template_path) if os.path.isfile(template_path) else template_path
    
    # Check if state exists
    state_list = run_terraform_command(["state", "list"], working_dir)
    if not state_list["success"]:
        return "Failed to retrieve Terraform state. Make sure the environment is properly initialized."
    
    if not state_list["stdout"].strip():
        return "No resources found in Terraform state. Cannot detect drift."
    
    # Run plan to detect drift
    plan_result = run_terraform_command(["plan", "-out=tfplan"], working_dir)
    if not plan_result["success"]:
        return f"Failed to create plan: {plan_result['stderr']}"
    
    # Convert plan to JSON
    show_result = run_terraform_command(["show", "-json", "tfplan"], working_dir)
    if not show_result["success"]:
        return f"Failed to parse plan: {show_result['stderr']}"
    
    # Analyze the plan
    plan_analysis = parse_tf_plan(show_result["stdout"])
    if "error" in plan_analysis:
        return plan_analysis["error"]
    
    if not plan_analysis["has_changes"]:
        return "No drift detected. Infrastructure matches the Terraform state."
    
    response = "Infrastructure drift detected:\n"
    
    if plan_analysis["add"]:
        response += "\nResources to be added:\n" + "\n".join([f"- {r}" for r in plan_analysis["add"]])
    
    if plan_analysis["change"]:
        response += "\nResources to be modified:\n" + "\n".join([f"- {r}" for r in plan_analysis["change"]])
    
    if plan_analysis["destroy"]:
        response += "\nResources to be destroyed:\n" + "\n".join([f"- {r}" for r in plan_analysis["destroy"]])
    
    return response

@mcp.tool()
async def check_best_practices(template_path: str) -> str:
    """Check Terraform templates for best practices and security issues.
    
    Args:
        template_path: Path to the Terraform template file or directory
    """
    working_dir = os.path.dirname(template_path) if os.path.isfile(template_path) else template_path
    
    # Use tfsec if available
    try:
        result = subprocess.run(
            ["tfsec", working_dir, "--format", "json"],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0 and not result.stdout:
            return f"Error running tfsec: {result.stderr}"
        
        findings = json.loads(result.stdout)
        if not findings.get("results", []):
            return "No issues found. All best practices are followed."
        
        response = "Best practices issues found:\n\n"
        for finding in findings.get("results", []):
            response += f"- {finding.get('description', 'Unknown issue')}\n"
            response += f"  Severity: {finding.get('severity', 'unknown')}\n"
            response += f"  File: {finding.get('location', {}).get('filename', 'unknown')}\n"
            response += f"  Line: {finding.get('location', {}).get('start_line', 'unknown')}\n"
            response += f"  Recommendation: {finding.get('resolution', 'No recommendation available')}\n\n"
            
        return response
    except (subprocess.SubprocessError, json.JSONDecodeError, FileNotFoundError):
        # Fallback to basic checks if tfsec is not available
        return "tfsec not available. Please install tfsec for comprehensive best practice checking."

def check_if_subnet_is_public(subnet_details):
    """Determine if a subnet is public based on its attributes."""
    # This is a simplified check - you might want to enhance it
    # A subnet is typically public if it has a route to an internet gateway
    tags = subnet_details.get("values", {}).get("tags", {})
    if tags and isinstance(tags, dict):
        if tags.get("Name", "").lower().find("public") >= 0:
            return True
    # Default to private if we can't determine
    return False

@mcp.tool()
async def generate_architecture_diagram(template_path: str, output_path: str) -> str:
    """Generate an architecture diagram from Terraform templates.
    
    Args:
        template_path: Path to the Terraform template file or directory
        output_path: Path where the diagram should be saved
    """
    working_dir = os.path.dirname(template_path) if os.path.isfile(template_path) else template_path
    
    # Get resources from Terraform state
    state_list = run_terraform_command(["state", "list"], working_dir)
    if not state_list["success"]:
        return "Failed to retrieve Terraform state. Make sure the environment is properly initialized."
    
    resources = state_list["stdout"].strip().split('\n')
    if not resources or resources == [""]:
        return "No resources found in Terraform state."
    
    # Get detailed info about each resource
    resource_details = {}
    for resource in resources:
        if not resource:
            continue
        
        show_result = run_terraform_command(["state", "show", "-json", resource], working_dir)
        if show_result["success"]:
            try:
                resource_details[resource] = json.loads(show_result["stdout"])
            except json.JSONDecodeError:
                pass
    
    # Generate diagram
    try:
        with Diagram("AWS Architecture", filename=os.path.splitext(output_path)[0], show=False):
            # Create VPC if exists
            vpc_resources = [r for r in resource_details if "aws_vpc" in r]
            
            if vpc_resources:
                with Cluster("VPC"):
                    vpc = VPC("VPC")
                    
                    # Add Internet Gateway if exists
                    igw_resources = [r for r in resource_details if "aws_internet_gateway" in r]
                    if igw_resources:
                        igw = InternetGateway("Internet Gateway")
                        vpc >> igw
                    
                    # Find this part in your generate_architecture_diagram function:
                    subnet_resources = [r for r in resource_details if "aws_subnet" in r]
                    subnets = {}
                    for subnet_resource in subnet_resources:
                        subnet_details = resource_details.get(subnet_resource, {})
                        subnet_id = subnet_details.get("values", {}).get("id", "subnet")
                        # Check if this is a public or private subnet based on route tables or tags
                        is_public = check_if_subnet_is_public(subnet_details)  # You'll need to implement this function
                        if is_public:
                            subnets[subnet_id] = PublicSubnet(f"Subnet {subnet_id}")
                        else:
                            subnets[subnet_id] = PrivateSubnet(f"Subnet {subnet_id}")
                        vpc >> subnets[subnet_id]
                    
                    # Add EC2 instances if exist
                    ec2_resources = [r for r in resource_details if "aws_instance" in r]
                    for ec2_resource in ec2_resources:
                        ec2_details = resource_details.get(ec2_resource, {})
                        ec2_id = ec2_details.get("values", {}).get("id", "ec2")
                        subnet_id = ec2_details.get("values", {}).get("subnet_id")
                        
                        ec2 = EC2(f"EC2 {ec2_id}")
                        if subnet_id and subnet_id in subnets:
                            subnets[subnet_id] >> ec2
                        else:
                            vpc >> ec2
                    
                    # Add RDS instances if exist
                    rds_resources = [r for r in resource_details if "aws_db_instance" in r]
                    for rds_resource in rds_resources:
                        rds_details = resource_details.get(rds_resource, {})
                        rds_id = rds_details.get("values", {}).get("id", "rds")
                        subnet_group = rds_details.get("values", {}).get("db_subnet_group_name")
                        
                        rds = RDS(f"RDS {rds_id}")
                        vpc >> rds
            else:
                # If no VPC, just add resources at top level
                # Add EC2 instances
                ec2_resources = [r for r in resource_details if "aws_instance" in r]
                for ec2_resource in ec2_resources:
                    ec2_details = resource_details.get(ec2_resource, {})
                    ec2_id = ec2_details.get("values", {}).get("id", "ec2")
                    EC2(f"EC2 {ec2_id}")
                
                # Add RDS instances
                rds_resources = [r for r in resource_details if "aws_db_instance" in r]
                for rds_resource in rds_resources:
                    rds_details = resource_details.get(rds_resource, {})
                    rds_id = rds_details.get("values", {}).get("id", "rds")
                    RDS(f"RDS {rds_id}")
        
        return f"Architecture diagram generated and saved to {output_path}"
    except Exception as e:
        return f"Failed to generate diagram: {str(e)}"

@mcp.tool()
async def deploy_terraform(template_path: str, auto_approve: bool = False) -> str:
    """Deploy infrastructure using Terraform.
    
    Args:
        template_path: Path to the Terraform template file or directory
        auto_approve: Whether to automatically approve the deployment without confirmation
    """
    working_dir = os.path.dirname(template_path) if os.path.isfile(template_path) else template_path
    
    # Initialize
    init_result = run_terraform_command(["init"], working_dir)
    if not init_result["success"]:
        return f"Failed to initialize Terraform: {init_result['stderr']}"
    
    # Plan
    plan_result = run_terraform_command(["plan"], working_dir)
    if not plan_result["success"]:
        return f"Failed to create plan: {plan_result['stderr']}"
    
    # Apply
    apply_command = ["apply"]
    if auto_approve:
        apply_command.append("-auto-approve")
    
    apply_result = run_terraform_command(apply_command, working_dir)
    if not apply_result["success"]:
        return f"Deployment failed: {apply_result['stderr']}"
    
    return "Deployment successful: " + apply_result["stdout"]

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')