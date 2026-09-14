import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CSV_PATH = "c:/uoky/mcp_server/data/test.csv"

class CSVManager:
    """专用CSV文件管理器"""
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.df = self._load_file()
        
    def _load_file(self) -> pd.DataFrame:
        """加载CSV文件"""
        try:
            return pd.read_csv(self.file_path)
        except Exception as e:
            logger.error(f"加载文件失败: {str(e)}")
            raise
            
    def query_data(self, query: str) -> list[dict]:
        """执行数据查询"""
        try:
            return self.df.query(query).to_dict('records')
        except Exception as e:
            logger.error(f"查询失败: {str(e)}")
            raise
            
    def get_columns(self) -> list[str]:
        """获取所有列名"""
        return self.df.columns.tolist()

csv_manager = CSVManager(CSV_PATH)