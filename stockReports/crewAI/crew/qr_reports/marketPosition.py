from crewAI.crew.qr_reports.base import BaseCrew
from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import FileReadTool

@CrewBase
class MarketPositionCrew(BaseCrew):
    agents_config = "/Users/chayfadida/Projects/FinalProject/stockReports/crewAI/configs/marketPosition/agents.yaml"
    tasks_config = "/Users/chayfadida/Projects/FinalProject/stockReports/crewAI/configs/marketPosition/tasks.yaml"
    
    def __init__(self, stock: str):
        super().__init__(stock)
        
    @agent
    def emerging_trends_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['emerging_trends_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=self.file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=self.file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def competitive_landscape_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['competitive_landscape_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=self.file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=self.file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def customer_perception_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['customer_perception_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=self.file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=self.file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def market_summary_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['market_summary_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[],
        )

    @task
    def emerging_trends_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['emerging_trends_analysis'],
            agent=self.emerging_trends_agent(),
        )

    @task
    def competitive_landscape_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['competitive_landscape_analysis'],
            agent=self.competitive_landscape_agent(),
        )

    @task
    def customer_perception_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['customer_perception_analysis'],
            agent=self.customer_perception_agent(),
        )

    @task
    def market_summary(self) -> Task:
        return Task(
            config=self.tasks_config['market_summary'],
            agent=self.market_summary_agent(),
        )

    @crew
    def getCrew(self) -> Crew:
        """Creates Market Position Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
