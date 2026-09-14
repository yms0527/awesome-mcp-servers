"""Find data sources prompt implementation."""

import os
from pathlib import Path
from typing import List, Optional


async def find_datasources(directory_path: str = ".") -> str:
    """Discover available data files and present them as load options."""
    try:
        # Get the current working directory or specified path
        current_dir = Path(directory_path).resolve()
        
        # Find .csv and .json files
        csv_files = list(current_dir.glob("*.csv"))
        json_files = list(current_dir.glob("*.json"))
        
        # Also check common data subdirectories
        data_subdirs = ["data", "datasets", "files"]
        subdir_files = []
        
        for subdir in data_subdirs:
            subdir_path = current_dir / subdir
            if subdir_path.exists() and subdir_path.is_dir():
                subdir_csv = list(subdir_path.glob("*.csv"))
                subdir_json = list(subdir_path.glob("*.json"))
                if subdir_csv or subdir_json:
                    subdir_files.append((subdir, subdir_csv + subdir_json))
        
        # Build the prompt response
        prompt = f"""📁 **Data Source Discovery: {current_dir.name}**

Looking for data files in: `{current_dir}`

"""
        
        # Current directory files
        if csv_files or json_files:
            prompt += f"**📊 Data files found in current directory:**\n\n"
            
            all_current_files = sorted(csv_files + json_files, key=lambda x: x.name.lower())
            for file_path in all_current_files:
                file_size = file_path.stat().st_size
                size_str = format_file_size(file_size)
                file_type = file_path.suffix.upper()[1:]  # Remove the dot
                
                # Generate suggested dataset name (filename without extension)
                suggested_name = file_path.stem.lower().replace(" ", "_").replace("-", "_")
                
                prompt += f"• **{file_path.name}** ({file_type}, {size_str})\n"
                prompt += f"  → `load_dataset('{file_path}', '{suggested_name}')`\n\n"
        
        # Subdirectory files
        if subdir_files:
            prompt += f"**📂 Data files found in subdirectories:**\n\n"
            
            for subdir_name, files in subdir_files:
                prompt += f"**{subdir_name}/ directory:**\n"
                
                sorted_files = sorted(files, key=lambda x: x.name.lower())
                for file_path in sorted_files:
                    file_size = file_path.stat().st_size
                    size_str = format_file_size(file_size)
                    file_type = file_path.suffix.upper()[1:]
                    
                    # Generate suggested dataset name
                    suggested_name = file_path.stem.lower().replace(" ", "_").replace("-", "_")
                    
                    prompt += f"  • **{file_path.name}** ({file_type}, {size_str})\n"
                    prompt += f"    → `load_dataset('{file_path}', '{suggested_name}')`\n"
                
                prompt += "\n"
        
        # No files found
        if not csv_files and not json_files and not subdir_files:
            prompt += f"""**❌ No data files found**

No .csv or .json files were found in:
• Current directory: `{current_dir}`
• Common data subdirectories: {', '.join(data_subdirs)}

**💡 Suggestions:**
• Check if you're in the correct directory
• Look for data files with different extensions
• Create sample data files for testing
• Download sample datasets from online sources

**🔍 Manual file search:**
You can also manually specify file paths:
• `load_dataset('path/to/your/file.csv', 'my_dataset')`
• `load_dataset('path/to/your/file.json', 'my_dataset')`
"""
        else:
            # Add usage instructions
            total_files = len(csv_files) + len(json_files) + sum(len(files) for _, files in subdir_files)
            prompt += f"""**🚀 Ready to load data!**

Found **{total_files} data file(s)** ready for analysis.

**Next steps:**
1. Copy one of the `load_dataset()` commands above
2. Run it to load your data into memory
3. Start exploring with `dataset_first_look('dataset_name')`

**💡 Pro tips:**
• Choose descriptive dataset names for easier reference
• Larger files may take longer to load
• You can load multiple datasets simultaneously
• Use `list_loaded_datasets()` to see what's currently loaded

**🔧 Advanced loading options:**
• Sample large datasets: `load_dataset('file.csv', 'name', sample_size=1000)`
• Custom paths: `load_dataset('/full/path/to/file.csv', 'name')`
"""
        
        return prompt
        
    except Exception as e:
        return f"""**❌ Error discovering data sources**

Failed to scan directory: {str(e)}

**💡 Troubleshooting:**
• Check if the directory path exists and is accessible
• Ensure you have read permissions for the directory
• Try specifying a different directory path
• Use absolute paths if relative paths aren't working

**Manual alternative:**
If automatic discovery isn't working, you can still load data manually:
`load_dataset('your_file.csv', 'dataset_name')`
"""


def format_file_size(size_bytes: int) -> str:
    """Convert file size in bytes to human readable format."""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    size = float(size_bytes)
    
    while size >= 1024.0 and i < len(size_names) - 1:
        size /= 1024.0
        i += 1
    
    if i == 0:
        return f"{int(size)} {size_names[i]}"
    else:
        return f"{size:.1f} {size_names[i]}"