from enum import Enum, unique

@unique
class ReportType(Enum):
    WEB_REPORT = "web_report"
    QK_REPORT = "qk_report"
    BOTH = "both"
    def __str__(self):
        return self.name