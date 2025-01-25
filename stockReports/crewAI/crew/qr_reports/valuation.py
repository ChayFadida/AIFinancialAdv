from crewAI.crew.qr_reports.base import BaseCrew
from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import FileReadTool

@CrewBase
class ValuationCrew(BaseCrew):
    agents_config = "/Users/chayfadida/Projects/FinalProject/stockReports/crewAI/configs/valuation/agents.yaml"
    tasks_config = "/Users/chayfadida/Projects/FinalProject/stockReports/crewAI/configs/valuation/tasks.yaml"

    def __init__(self, stock: str):
        super().__init__(stock)

    @agent
    def intrinsic_valuation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['intrinsic_valuation_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=self.file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=self.file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def relative_valuation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['relative_valuation_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=self.file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=self.file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def growth_potential_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['growth_potential_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=self.file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=self.file_read_tool_desc),
                CalculatorTool(),
            ]
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
