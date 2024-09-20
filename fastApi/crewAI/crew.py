from crewAI.agents import MarketingAnalysisAgents
from crewAI.tasks import MarketingAnalysisTasks
from crewai import Crew
agents = MarketingAnalysisAgents("openhermes")
tasks = MarketingAnalysisTasks()

stock_analysis_agent = agents.stock_analysis_agent()
best_stock_analysis_task = tasks.best_stock_analysis(stock_analysis_agent)


analysis_crew = Crew(
	agents=[
		stock_analysis_agent
	],
	tasks=[
		best_stock_analysis_task
	],
	verbose=True
)

result = analysis_crew.kickoff()


if __name__ == '__main__':
    
	agents = MarketingAnalysisAgents("openhermes")
	tasks = MarketingAnalysisTasks()

	stock_analysis_agent = agents.stock_analysis_agent()
	best_stock_analysis_task = tasks.best_stock_analysis(stock_analysis_agent)


	analysis_crew = Crew(
		agents=[
			stock_analysis_agent
		],
		tasks=[
			best_stock_analysis_task
		],
		verbose=True
	)

	result = analysis_crew.kickoff()