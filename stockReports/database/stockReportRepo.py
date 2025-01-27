from datetime import datetime
from pymongo.collection import Collection
from fastapi import HTTPException
from utils.types.report_types import ReportType
class StockReportRepository:
    def __init__(self, collection: Collection):
        self.collection = collection

    def add_report(self, stock_symbol: str, analysis_data: dict, report_type: ReportType):
        """
        Add a stock report to the database.

        Args:
            stock_symbol (str): The stock symbol.
            analysis_data (dict): The analysis results for the stock.

        Returns:
            dict: The inserted document ID and stock details.
        """
        if not stock_symbol.isalpha():
            raise HTTPException(status_code=400, detail="Invalid stock symbol. Must be alphabetic.")
        
        report = {
            "stock_symbol": stock_symbol.upper(),
            "analysis_data": analysis_data,
            "created_at": datetime.utcnow(),
            "report_type": report_type.name
        }
        result = self.collection.insert_one(report)
        return {"id": str(result.inserted_id), "stock_symbol": stock_symbol}

    def get_all_reports(self):
        """
        Retrieve all stock reports from the database.

        Returns:
            list: A list of all reports.
        """
        return list(self.collection.find({}, {"_id": 0}))

    def get_latest_report(self, stock_symbol: str, report_type: ReportType):
        """
        Retrieve the latest report for a specific stock symbol from the database.

        Args:
            stock_symbol (str): The stock symbol to query.

        Returns:
            dict: The latest report for the stock symbol.
        """
        report = self.collection.find_one(
            {
                "stock_symbol": stock_symbol.upper(),
                "report_type": report_type.name
             },
            sort=[("created_at", -1)],  # Sort by created_at descending to get the latest
            projection={"_id": 0}  # Exclude the _id field from the result
        )
        
        if not report:
            raise HTTPException(status_code=404, detail=f"No report found for stock symbol {stock_symbol}.")
        
        return report

    def get_reports_by_stock_symbol(self, stock_symbol: str):
        """
        Retrieve all reports for a specific stock symbol from the database.

        Args:
            stock_symbol (str): The stock symbol to filter by.

        Returns:
            list: A list of all reports for the stock symbol.
        """
        reports = list(self.collection.find({"stock_symbol": stock_symbol.upper()}, {"_id": 0}))

        if not reports:
            raise HTTPException(status_code=404, detail=f"No reports found for stock symbol {stock_symbol}.")
        
        return reports