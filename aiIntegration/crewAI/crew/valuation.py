from crewAI.crew.base import BaseCrew
from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from utils.types.report_types import ReportType

@CrewBase
class ValuationCrew(BaseCrew):
    agents_config = "configs/valuation/agents.yaml"
    tasks_config = "configs/valuation/tasks.yaml"

    def __init__(self, stock: str, report_type: ReportType):
        super().__init__(stock, report_type)

    @agent
    def intrinsic_valuation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['intrinsic_valuation_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def relative_valuation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['relative_valuation_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def growth_potential_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['growth_potential_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def valuation_summary_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['valuation_summary_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[],
        )

    @task
    def intrinsic_valuation_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['intrinsic_valuation_analysis'],
            agent=self.intrinsic_valuation_agent(),
        )

    @task
    def relative_valuation_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['relative_valuation_analysis'],
            agent=self.relative_valuation_agent(),
        )

    @task
    def growth_potential_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['growth_potential_analysis'],
            agent=self.growth_potential_agent(),
        )

    @task
    def valuation_summary(self) -> Task:
        return Task(
            config=self.tasks_config['valuation_summary'],
            agent=self.valuation_summary_agent(),
        )

    @crew
    def getCrew(self) -> Crew:
        """Creates Valuation Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
