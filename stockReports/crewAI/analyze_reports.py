from config.logger_config import log
from utils.analysis_types import AnalysisType
from crewAI.crew.qr_reports.risk import RiskCrew
from crewAI.crew.qr_reports.growth import GrowthCrew
from concurrent.futures import ThreadPoolExecutor, as_completed
import concurrent.futures

class ReportGeneration:
   
    @staticmethod
    def analyze(analysis_type: AnalysisType, stock_symbol: str):
        inputs = {
            'query': 'What is the company you want to analyze?',
            'company_stock': stock_symbol,
        }
        # Mapping enum values to crew methods
        analysType_crew = {
            AnalysisType.RISK: RiskCrew,
            AnalysisType.GROWTH: GrowthCrew
        }
        crew_method = analysType_crew.get(analysis_type)
        if not crew_method:
            log.error(f"Unsupported analysis type: {analysis_type}")
            return None
        log.info(f"Kickoff AI for {analysis_type.value} analysis for {stock_symbol}")
        crew_instance = crew_method(stock_symbol)
        crew_output = crew_instance.getCrew().kickoff(inputs=inputs)
        try:
            taks_output = crew_output.model_dump()['tasks_output'][-1]['raw']
        except (KeyError, IndexError, AttributeError) as e:
            log.error(f"Error accessing 'tasks_output': {e}")
            taks_output = None
        
        return taks_output
    
    @staticmethod
    def getReport(stock_symbol: str):
        results = []
        with ThreadPoolExecutor(max_workers=2) as executor:
            # Submit the analysis tasks to the executor
            future_risks = executor.submit(ReportGeneration.analyze, AnalysisType.RISK, stock_symbol)
            future_grow = executor.submit(ReportGeneration.analyze, AnalysisType.GROWTH, stock_symbol)
            
            # Wait for the tasks to complete and store the results in the dictionary
            futures = [future_risks, future_grow]
            for f in as_completed(futures):
                results.append(f.result())
        res = {"risks": results[0], "grow": results[1]}
        return res

    