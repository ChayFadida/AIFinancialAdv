from datetime import datetime
from pymongo.collection import Collection
from fastapi import HTTPException
from utils.types.report_types import ReportType
from bson import ObjectId
from utils.types.report_status import ReportStatus

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
            "report_type": report_type.value,
            "status": "done"
        }
        result = self.collection.insert_one(report)
        return {"id": str(result.inserted_id), "stock_symbol": stock_symbol}

    def create_report_placeholder(self, stock_symbol: str, report_type: ReportType):
        """
        Create a placeholder entry in the database indicating that the report generation is in progress.

        Args:
            stock_symbol (str): The stock symbol.
            report_type (ReportType): The type of report.

        Returns:
            str: The ID of the inserted placeholder report.
        """
        report = {
            "stock_symbol": stock_symbol.upper(),
            "analysis_data": None,  # Placeholder for actual data
            "created_at": datetime.utcnow(),
            "report_type": report_type.value,
            "status": "in_progress"
        }
        result = self.collection.insert_one(report)
        return str(result.inserted_id) 

    def update_report_status(self, report_id: str, status: str, analysis_data: dict = None):
        """
        Update the status of a report in the database by its unique ID.

        Args:
            report_id (str): The unique ID of the report to update.
            status (str): The new status ('in_progress', 'done', 'failed').
            analysis_data (dict, optional): The analysis data to update, if available.

        Returns:
            dict: A response indicating the status of the update.
        """
        update_fields = {"status": status}
        if analysis_data is not None:
            update_fields["analysis_data"] = analysis_data

        result = self.collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": update_fields}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail=f"No matching report found with ID {report_id}.")
        return {"status": "updated", "id": report_id}

    def get_all_reports(self):
        """
        Retrieve all stock reports from the database with status 'IN_PROGRESS' or 'DONE'.

        Returns:
            list: A list of all reports with status 'in_progress' or 'done'.
        """
        return list(self.collection.find(
            {"status": {"$in": [ReportStatus.IN_PROGRESS.value, ReportStatus.DONE.value]}},  # Correct syntax
            {"_id": 0}  # Exclude the _id field from the result
        ))

    def get_latest_report(self, stock_symbol: str, report_type: ReportType, report_status: ReportStatus):
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
                "report_type": report_type.value,
                "status": report_status.value
             },
            sort=[("created_at", -1)],  # Sort by created_at descending to get the latest
            projection={"_id": 0}  # Exclude the _id field from the result
        )
        
        if not report:
            return {}
        
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