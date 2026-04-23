"""Dataset first look prompt implementation."""

from mcp.server.fastmcp.prompts import base
from typing import List, Optional
from ..models.schemas import DatasetManager, dataset_schemas


async def dataset_first_look(dataset_name: str) -> str:
    """Adaptive first-look analysis based on dataset characteristics."""
    try:
        if dataset_name not in dataset_schemas:
            return f"Dataset '{dataset_name}' not loaded. Use load_dataset() tool first."
        
        schema = dataset_schemas[dataset_name]
        
        # Organize columns by type for display
        numerical_cols = [name for name, info in schema.columns.items() 
                         if info.suggested_role == 'numerical']
        categorical_cols = [name for name, info in schema.columns.items() 
                           if info.suggested_role == 'categorical']
        temporal_cols = [name for name, info in schema.columns.items() 
                        if info.suggested_role == 'temporal']
        identifier_cols = [name for name, info in schema.columns.items() 
                          if info.suggested_role == 'identifier']
        
        prompt = f"""Let's explore your **{dataset_name}** dataset together! 

I can see you have **{schema.row_count:,} records** with **{len(schema.columns)} columns**:

"""
        
        if numerical_cols:
            prompt += f"**📊 Numerical columns** ({len(numerical_cols)}): {', '.join(numerical_cols)}\n"
            prompt += "→ Perfect for correlation analysis, statistical summaries, and trend analysis\n\n"
        
        if categorical_cols:
            prompt += f"**🏷️ Categorical columns** ({len(categorical_cols)}): {', '.join(categorical_cols)}\n"  
            prompt += "→ Great for segmentation, group comparisons, and distribution analysis\n\n"
        
        if temporal_cols:
            prompt += f"**📅 Date/Time columns** ({len(temporal_cols)}): {', '.join(temporal_cols)}\n"
            prompt += "→ Ideal for time series analysis and trend identification\n\n"
        
        if identifier_cols:
            prompt += f"**🔑 Identifier columns** ({len(identifier_cols)}): {', '.join(identifier_cols)}\n"
            prompt += "→ Useful for data validation and uniqueness checks\n\n"
        
        # Add specific recommendations based on data
        prompt += "**🎯 Recommended starting points:**\n"
        
        if len(numerical_cols) >= 2:
            prompt += f"• **Correlation Analysis**: Explore relationships between {numerical_cols[0]} and {numerical_cols[1]}\n"
            prompt += f"  Command: `find_correlations('{dataset_name}')`\n"
        
        if categorical_cols and numerical_cols:
            prompt += f"• **Segmentation**: Group by {categorical_cols[0]} to analyze {numerical_cols[0]} patterns\n"
            prompt += f"  Command: `segment_by_column('{dataset_name}', '{categorical_cols[0]}')`\n"
        
        if temporal_cols and numerical_cols:
            prompt += f"• **Time Trends**: Track {numerical_cols[0]} changes over {temporal_cols[0]}\n"
            prompt += f"  Command: `time_series_analysis('{dataset_name}', '{temporal_cols[0]}', '{numerical_cols[0]}')`\n"
        
        # Data quality insights
        high_null_cols = [name for name, info in schema.columns.items() 
                         if info.null_percentage > 10]
        if high_null_cols:
            prompt += f"• **Data Quality Review**: {len(high_null_cols)} columns have missing values to investigate\n"
            prompt += f"  Command: `validate_data_quality('{dataset_name}')`\n"
        
        prompt += f"\n**Available tools**: `segment_by_column`, `find_correlations`, `create_chart`, `validate_data_quality`, `analyze_distributions`, `detect_outliers`\n"
        
        # Add visualization suggestions
        if numerical_cols:
            prompt += f"\n**📈 Visualization ideas:**\n"
            prompt += f"• Histogram: `create_chart('{dataset_name}', 'histogram', '{numerical_cols[0]}')`\n"
            if len(numerical_cols) >= 2:
                prompt += f"• Scatter plot: `create_chart('{dataset_name}', 'scatter', '{numerical_cols[0]}', '{numerical_cols[1]}')`\n"
            if categorical_cols:
                prompt += f"• Bar chart: `create_chart('{dataset_name}', 'bar', '{categorical_cols[0]}', '{numerical_cols[0]}')`\n"
        
        prompt += f"\nWhat aspect of your **{dataset_name}** data would you like to explore first?"
        
        return prompt
        
    except Exception as e:
        return f"Error generating first look prompt: {str(e)}"