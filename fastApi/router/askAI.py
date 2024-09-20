from fastapi import APIRouter, Query, Depends
from dependency.dependencies import dependency_container
from crewai import Crew

router = APIRouter(prefix="/askAI")

def get_agents_and_tasks():
    return dependency_container.initialize()

def createAIAnswer(agents, tasks):
    return Crew(agents=[
                    agents
                ],
                tasks=[
                    tasks
                ],
                verbose=True).kickoff()

@router.post('/')
def ask_ai_question(question: str = Query(..., description="The question to ask the AI"), agents_and_tasks = Depends(get_agents_and_tasks)):
    agents, tasks = agents_and_tasks
    task = tasks.createYourOwnTask(agent=agents, task=question)
    return {"response": createAIAnswer(agents, task)}
