from crewAI.crew.base import BaseCrew
from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from utils.types.report_types import ReportType

@CrewBase
class GrowthCrew(BaseCrew):
    agents_config = "configs/growth/agents.yaml"
    tasks_config = "configs/growth/tasks.yaml"
    def __init__(self, stock: str, report_type: ReportType):
        super().__init__(stock, report_type)

    @agent
    def market_expansion_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['market_expansion_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def product_innovation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['product_innovation_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def mergers_acquisitions_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['mergers_acquisitions_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def growth_recommendation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['growth_recommendation_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[]
        )
    
    @task
    def market_expansion_analysis(self) -> Task: 
        return Task(
            config=self.tasks_config['market_expansion_analysis'],
            agent=self.market_expansion_agent(),
        )

    @task
    def mergers_acquisitions_assessment(self) -> Task:
        return Task(
            config=self.tasks_config['mergers_acquisitions_assessment'],
            agent=self.mergers_acquisitions_agent(),
        )

    @task
    def product_innovation_impact(self) -> Task:
        return Task(
            config=self.tasks_config['product_innovation_impact'],
            agent=self.product_innovation_agent(),
        )

    @task
    def growth_recommendation(self) -> Task:
        return Task(
            config=self.tasks_config['growth_summary'],
            agent=self.growth_recommendation_agent(),
        )

    @crew
    def getCrew(self) -> Crew:
        """Creates Growth Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
