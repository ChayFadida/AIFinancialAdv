from textwrap import dedent
from crewai import Agent
from langchain_community.llms import Ollama

class MarketingAnalysisAgents:
    def __init__(self, model):
        self.llm = Ollama(model=model)
    
    def say_hello(self):
        return "hello"

    def stock_analysis_agent(self):
        return Agent(role = "Stock analysis",
                      goal = """Provide the solution to the students that are asking mathematical questions and give them the answer.""",
                      backstory = """You are an excellent math professor that likes to solve math questions in a way that everyone can understand your solution""",
                      allow_delegation = False,
                      verbose = True,
                      llm = self.llm)