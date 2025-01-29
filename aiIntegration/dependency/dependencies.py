# dependencies.py
from database.dbHandler import Database
from database.stockReportRepo import StockReportRepository
from config.app_contex import DB_URL, DB_NAME

# Initialize the database
db_instance = Database(
    uri=DB_URL,
    db_name=DB_NAME
)

# Initialize the repository
stock_report_repo = StockReportRepository(db_instance.get_collection("analyzeReportsResults"))

# Dependency to get the repository
def get_stock_report_repo() -> StockReportRepository:
    return stock_report_repo
