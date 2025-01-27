from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from config.app_contex import AI_MODEL
from crewai import LLM

content =  {"the best recommendation": "hello my name is chay and i know everything in this world, i say do not invest in intel INTC stock"}
string_source = StringKnowledgeSource(content=content["the best recommendation"])
llm = LLM(model=f"ollama/{AI_MODEL}")

@CrewBase
class SummaryCrew():
    agents_config = "/Users/chayfadida/Projects/FinalProject/stockReports/crewAI/configs/summary/agents.yaml"
    tasks_config = "/Users/chayfadida/Projects/FinalProject/stockReports/crewAI/configs/summary/tasks.yaml"
    
    def __init__(self, stock: str, resultsToSummary: dict):
        self.stock = stock.upper()
        self.llm = llm
        self.resultsToSummary = resultsToSummary

    def getStringKnowledgeSource(self):
        res = []
        for category, content in self.resultsToSummary.items():
            string_source = StringKnowledgeSource(content= f"This is a final results about the {category} of invest in the {self.stock}: {content}")
            res.append(string_source)
        return res

    @agent
    def summary_analyst_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['summary_analyst'],
            verbose=True,
            llm=self.llm,
            allow_delegation=False
        )

    @agent
    def recommendation_analyst_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['recommendation_analyst'],
            verbose=True,
            llm=self.llm,
            allow_delegation=False
        )

    @task
    def emerging_trends_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['summary_analysis'],
            agent=self.summary_analyst_agent(),
        )

    @task
    def competitive_landscape_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['final_recommendation'],
            agent=self.recommendation_analyst_agent(),
        )


    @crew
    def getCrew(self) -> Crew:
        """Creates Market Position Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            embedder={
                "provider": "ollama",
                "config": {"model": AI_MODEL}, # Set the embedding LLM here
            },
            knowledge_sources=self.getStringKnowledgeSource(),
        )