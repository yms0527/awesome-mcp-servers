"""Segmentation workshop prompt implementation."""

from typing import List, Optional
from ..models.schemas import DatasetManager, dataset_schemas


async def segmentation_workshop(dataset_name: str) -> str:
    """Interactive segmentation guidance based on actual dataset."""
    try:
        if dataset_name not in dataset_schemas:
            return f"Dataset '{dataset_name}' not loaded. Use load_dataset() tool first."
        
        schema = dataset_schemas[dataset_name]
        
        # Find categorical columns suitable for segmentation
        categorical_cols = [name for name, info in schema.columns.items() 
                           if info.suggested_role == 'categorical']
        numerical_cols = [name for name, info in schema.columns.items() 
                         if info.suggested_role == 'numerical']
        
        if not categorical_cols:
            return f"""**Segmentation Challenge: No categorical columns found in {dataset_name}**

Don't worry! You can still create meaningful segments:

**🔢 Numerical Segmentation Options:**
"""  + (f"""
• **Quantile-based segments**: Split {numerical_cols[0]} into high/medium/low groups
• **Threshold-based segments**: Above/below average {numerical_cols[0]}
• **Custom ranges**: Define meaningful business ranges for {numerical_cols[0]}

**💡 Pro tip**: Create categorical columns first using pandas:
```python
df['value_segment'] = pd.cut(df['{numerical_cols[0]}'], bins=3, labels=['Low', 'Medium', 'High'])
```

Then use: `segment_by_column('{dataset_name}', 'value_segment')`
""" if numerical_cols else """
• Consider loading additional data with categorical variables
• Check if any text columns could be categorized
• Create categories from existing numerical data using ranges
""")
        
        prompt = f"""Let's create meaningful segments from your **{dataset_name}** data!

**Available categorical columns for grouping:**
"""
        
        for col in categorical_cols:
            col_info = schema.columns[col]
            prompt += f"• **{col}**: {col_info.unique_values} unique values (examples: {', '.join(map(str, col_info.sample_values))})\n"
        
        if numerical_cols:
            prompt += f"\n**📊 Numerical columns to analyze by segment:**\n"
            for col in numerical_cols:
                col_info = schema.columns[col]
                prompt += f"• **{col}**: {col_info.dtype} (sample values: {', '.join(map(str, col_info.sample_values))})\n"
        
        prompt += f"""
**🎯 Segmentation strategies:**

1. **Simple segmentation**: Group by one categorical column
   Example: `segment_by_column('{dataset_name}', '{categorical_cols[0]}')`

2. **Cross-segmentation**: Combine multiple categories (manual analysis)
   Example: Group by {categorical_cols[0]}, then analyze patterns within each group

3. **Value-based segments**: Focus on high/low values of numerical columns"""
        
        if numerical_cols:
            prompt += f"""
   Example: Top 20% vs bottom 20% by {numerical_cols[0]}"""
        
        prompt += f"""

**📈 Suggested analysis workflow:**
1. Start with basic segmentation of your most important categorical variable
2. Look for interesting patterns in the numerical data
3. Create visualizations to show segment differences
4. Dive deeper into the most interesting segments

**Quick commands to try:**
• `segment_by_column('{dataset_name}', '{categorical_cols[0] if categorical_cols else "category_column"}')`"""
        
        if categorical_cols and numerical_cols:
            prompt += f"""
• `create_chart('{dataset_name}', 'bar', '{categorical_cols[0]}', '{numerical_cols[0]}')`"""
        
        prompt += f"""

Which segmentation approach interests you most? I can guide you through the specific analysis steps!"""
        
        return prompt
        
    except Exception as e:
        return f"Error generating segmentation workshop prompt: {str(e)}"