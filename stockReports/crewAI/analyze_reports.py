from config.logger_config import log
from utils.types.analysis_types import AnalysisType
from crewAI.crew.risk import RiskCrew
from crewAI.crew.growth import GrowthCrew
from crewAI.crew.valuation import ValuationCrew
from crewAI.crew.marketPosition import MarketPositionCrew
from crewAI.crew.summary import SummaryCrew
from concurrent.futures import ThreadPoolExecutor, as_completed
from utils.prompts.prompts import summary_prompt
from config.app_contex import AI_MODEL
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from crewAI.api.stock_api import YahooFinanceAPI
from utils.types.report_types import ReportType

llm = ChatOllama(model=AI_MODEL)
prompt = ChatPromptTemplate.from_template(summary_prompt)
chain = prompt | llm
class ReportGeneration:

    @staticmethod
    def _analyze_generic(analysis_type: AnalysisType, stock_symbol: str, report_type: ReportType, summary_dict: dict = None):
        # Build the base inputs dynamically based on the analysis type
        stock_price = YahooFinanceAPI.get_stock_price(stock_symbol)
        inputs = {'company_stock': stock_symbol, 'stock_price': stock_price}

        if summary_dict:
            # For summary analysis, build the query from the provided summary dictionary
            inputs['query'] = f"Based on the following stock analysis categories: {', '.join(summary_dict.keys())}, provide a recommendation to either buy, hold, or sell the stock of {stock_symbol}."
        else:
            # For non-summary analysis, ask for the company to analyze
            inputs['query'] = f"Provide a report about {stock_symbol}, considering that its stock price is currently {stock_price} USD. Based on this, evaluate whether it's recommended to invest in."

        # Dynamically map analysis types to crew methods (allowing for easy addition of new types)
        analysis_mapping = {
            AnalysisType.RISK: RiskCrew,
            AnalysisType.GROWTH: GrowthCrew,
            AnalysisType.VALUATION: ValuationCrew,
            AnalysisType.MARKET_POSITION: MarketPositionCrew,
            AnalysisType.SUMMARY: SummaryCrew,
        }

        crew_method = analysis_mapping.get(analysis_type)
        if not crew_method:
            log.error(f"Unsupported analysis type: {analysis_type}")
            return None

        log.info(f"Kickoff AI for {analysis_type.value} analysis for {stock_symbol}")
        
        # Pass the `summary_dict` only when needed, otherwise, skip it for regular analysis
        crew_instance = crew_method(stock_symbol, summary_dict) if summary_dict else crew_method(stock_symbol, report_type)
        crew_output = crew_instance.getCrew().kickoff(inputs=inputs)

        # Extract the raw output from the result, handling possible errors gracefully
        try:
            task_output = crew_output.model_dump()['tasks_output'][-1]['raw']
        except (KeyError, IndexError, AttributeError) as e:
            log.error(f"Error accessing 'tasks_output': {e}")
            task_output = None

        return task_output

    @staticmethod
    def analyze(analysis_type: AnalysisType, stock_symbol: str, report_type: ReportType, summary_dict: dict = None):
        # Call the generic analyzer, passing the summary_dict if present, otherwise None
        return ReportGeneration._analyze_generic(analysis_type, stock_symbol, report_type,summary_dict)

    @staticmethod
    def get_stock_rating(summary: str) -> int:
        # Prepare the input for the model with the given summary
        response = chain.invoke({"summary": summary})
        rating_response = response.content
        
        # Ensure the result is a valid integer between 1 and 100
        try:
            if 1 <= int(rating_response) <= 100:
                return rating_response
            else:
                raise ValueError("Rating out of valid range.")
        except (ValueError, TypeError):
            log.error("Invalid response from the model. Expected an integer between 1 and 100.")
            return -1  # Default fallback


    @staticmethod
    def getReport(stock_symbol: str, report_type: ReportType):
        results = {}
        with ThreadPoolExecutor(max_workers=4) as executor:
            # Dynamically submit the analysis tasks using the available analysis types
            analysis_types = [
                AnalysisType.RISK,
                AnalysisType.GROWTH,
                AnalysisType.VALUATION,
                AnalysisType.MARKET_POSITION
            ]
            futures = {executor.submit(ReportGeneration.analyze, analysis_type, stock_symbol, report_type): analysis_type for analysis_type in analysis_types}

            # Wait for the tasks to complete and store the results
            for future in as_completed(futures):
                result = future.result()
                analysis_type = futures[future]
                results[analysis_type.value.lower()] = result
                log.info(f"Task {analysis_type.value} is done with result: {result}")

        # Log the completion of the main report generation
        log.info(f"Finalize generating a report for {stock_symbol}")
        log.info(f"Starting to create a summary and final recommendation for {stock_symbol}")

        # Dynamically generate a summary based on the gathered results
        summary = ReportGeneration.analyze(AnalysisType.SUMMARY, stock_symbol, report_type, results)
        results['summary'] = summary
        results['score'] = ReportGeneration.get_stock_rating(summary)

        return results
