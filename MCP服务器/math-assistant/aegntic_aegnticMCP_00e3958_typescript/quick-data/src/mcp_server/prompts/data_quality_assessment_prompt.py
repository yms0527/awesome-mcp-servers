"""Data quality assessment prompt implementation."""

from typing import List, Optional
from ..models.schemas import DatasetManager, dataset_schemas


async def data_quality_assessment(dataset_name: str) -> str:
    """Guide systematic data quality review."""
    try:
        if dataset_name not in dataset_schemas:
            return f"Dataset '{dataset_name}' not loaded. Use load_dataset() tool first."
        
        schema = dataset_schemas[dataset_name]
        df = DatasetManager.get_dataset(dataset_name)
        
        prompt = f"""Let's systematically review the quality of your **{dataset_name}** dataset.

**📋 Dataset Overview:**
• **{schema.row_count:,} rows** × **{len(schema.columns)} columns**
• **Memory usage**: {df.memory_usage(deep=True).sum() / 1024**2:.1f} MB

**🔍 Data Quality Indicators:**
"""
        
        # Missing values analysis
        missing_data = []
        for col_name, col_info in schema.columns.items():
            if col_info.null_percentage > 0:
                missing_data.append((col_name, col_info.null_percentage))
        
        if missing_data:
            missing_data.sort(key=lambda x: x[1], reverse=True)
            prompt += f"\n**📋 Missing Values** ({len(missing_data)} columns affected):\n"
            for col, pct in missing_data[:5]:  # Show top 5
                status = "🔴" if pct > 50 else "🟡" if pct > 10 else "🟢"
                prompt += f"{status} **{col}**: {pct:.1f}% missing\n"
            if len(missing_data) > 5:
                prompt += f"• ... and {len(missing_data) - 5} more columns with missing data\n"
        else:
            prompt += f"\n**✅ Missing Values**: No missing values detected! Excellent data quality.\n"
        
        # Data type consistency
        object_cols = [name for name, info in schema.columns.items() 
                      if info.dtype == 'object' and info.suggested_role not in ['categorical', 'identifier']]
        
        if object_cols:
            prompt += f"\n**⚠️ Mixed Data Types**: {', '.join(object_cols)} may need type conversion\n"
        
        # Duplicates check (simple heuristic)
        potential_id_cols = [name for name, info in schema.columns.items() 
                            if info.suggested_role == 'identifier']
        
        if potential_id_cols:
            prompt += f"\n**🔍 Potential Duplicates**: Check uniqueness of {', '.join(potential_id_cols)}\n"
        
        # Column cardinality insights
        high_cardinality = [name for name, info in schema.columns.items() 
                           if info.unique_values > schema.row_count * 0.8]
        low_cardinality = [name for name, info in schema.columns.items() 
                          if info.unique_values < 10 and info.suggested_role == 'categorical']
        
        if high_cardinality:
            prompt += f"\n**📊 High Cardinality Columns**: {', '.join(high_cardinality)} (many unique values)\n"
            prompt += "→ Consider if these should be identifiers or need grouping\n"
        
        if low_cardinality:
            prompt += f"\n**🏷️ Low Cardinality Columns**: {', '.join(low_cardinality)} (few unique values)\n"
            prompt += "→ Perfect for segmentation and grouping analysis\n"
        
        prompt += f"""
**🎯 Recommended quality checks:**

1. **Comprehensive validation**: `validate_data_quality('{dataset_name}')` 
   → Get detailed quality report with recommendations

2. **Distribution analysis**: Check for outliers and unusual patterns
   → `analyze_distributions('{dataset_name}', 'column_name')`

3. **Outlier detection**: Find unusual values in numerical columns
   → `detect_outliers('{dataset_name}')`

4. **Correlation check**: Look for unexpected relationships
   → `find_correlations('{dataset_name}')`

**💡 Quick quality assessment commands:**
• `validate_data_quality('{dataset_name}')` - Full quality report
• `detect_outliers('{dataset_name}')` - Find unusual values"""
        
        if missing_data:
            most_missing_col = missing_data[0][0]
            prompt += f"""
• `analyze_distributions('{dataset_name}', '{most_missing_col}')` - Investigate missing data patterns"""
        
        prompt += f"""

**🔧 Common data quality improvements:**
• Remove or impute missing values
• Standardize categorical value formats
• Convert data types appropriately
• Remove duplicate records
• Handle outliers appropriately

What data quality aspect would you like to investigate first?"""
        
        return prompt
        
    except Exception as e:
        return f"Error generating data quality assessment prompt: {str(e)}"