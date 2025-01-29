from enum import Enum, unique

@unique
class ReportStatus(Enum):
    IN_PROGRESS = "in_progress"
    DONE = "done"
    def __str__(self):
        return self.name