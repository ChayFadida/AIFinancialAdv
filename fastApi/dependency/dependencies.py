from crewAI.agents import MarketingAnalysisAgents
from crewAI.tasks import MarketingAnalysisTasks
from config.app_contex import AI_MODEL
from database.dbHandler import DBHandler
from database.users import UserHandler

class DependencyContainer:
    def __init__(self):
        self.agents = None
        self.tasks = None
        self._dbHandler = DBHandler()
        self._userHandler = UserHandler(self._dbHandler)

    def initialize(self):
        if self.agents is None or self.tasks is None:
            self.agents = MarketingAnalysisAgents(AI_MODEL).stock_analysis_agent()
            self.tasks = MarketingAnalysisTasks()
        return self.agents, self.tasks

    # Getter and setter for dbHandler
    @property
    def dbHandler(self):
        return self._dbHandler
    @property
    def userHandler(self):
        return self._userHandler
dependency_container = DependencyContainer()
