from crewai import Agent
from crewai import Crew
from crewai import Task
from crewai import LLM
import os
from dotenv import load_dotenv
import yaml

# Load environment variables
load_dotenv()
api_key = os.getenv("API_KEY")

# Check if the API key is loaded correctly
if not api_key:
    raise ValueError("API_KEY is not set. Make sure the .env file contains the API key.")

print(f"Loaded API Key: {api_key}")
llm = LLM(model="gpt-4o", temperature=1.0, api_key=api_key)

def load_prompts(path):
    filepath = f"config/{path}.yaml"
    with open(filepath, 'r') as file:
        return yaml.safe_load(file)

def get_agent_prompt(agent, category, config, perspective=""):
    prompt = config['agents'][agent][category]
    return prompt.format(perspective=perspective)

def get_task_prompt(task, category, tasks, query="", perspective="", initial="", second=""):
    prompt = tasks['tasks'][task][category]
    return prompt.format(query=query, perspective=perspective, initial=initial, second=second)

config = load_prompts('agents')
tasks = load_prompts('tasks')

class TheBoard:
    """Class the contains three agents..."""
    def __init__(self, query, perspective):
        self.query = query,
        self.perspective = perspective,
        self.llm = llm

        self.generator = Agent(
            role=get_agent_prompt('generator','role', config),
            goal=get_agent_prompt('generator', 'goal', config, self.perspective),
            backstory=get_agent_prompt('generator', 'backstory', config, self.perspective),
            verbose=True,
            memory=True,
            llm=self.llm,
            tools=[],
            allow_delegation=True,
        )

        self.refinor = Agent(
            role=get_agent_prompt('refiner', 'role', config),
            goal=get_agent_prompt('refiner', 'goal', config, self.perspective),
            backstory=get_agent_prompt('refiner', 'backstory', config, self.perspective),
            verbose=True,
            memory=True,
            llm=self.llm,
            tools=[],
            allow_delegation=True,
        )

        self.conversationalist = Agent(
            role=get_agent_prompt('conversationalist', 'role', config),
            goal=get_agent_prompt('conversationalist', 'goal', config),
            backstory=get_agent_prompt('conversationalist', 'backstory', config),
            verbose=True,
            memory=True,
            llm=self.llm,
            tools=[],
            allow_delegation=True,
        )

    def initial_attempt(self):
        first_shot = Task(
            description=get_task_prompt('generator_task', 'description',
                                        tasks, query=self.query, 
                                        perspective=self.perspective),
            expected_output=get_task_prompt('generator_task', 'expected_output',
                                        tasks),
            async_execution=False,
            output_file="/o/initial_thoughts.txt",
            agent=self.generator,
        )
        print(f"Initializing Crew with API Key: {self.llm.api_key}")
        crew = Crew(agents=[self.generator], tasks=[first_shot])
        result = crew.kickoff()
        return result

    def refine_attempt(self, initial_attempt):
        second_shot = Task(
            description=get_task_prompt('refiner_task', 'description',
                                        tasks, initial=initial_attempt, 
                                        perspective=self.perspective),
            expected_output=get_task_prompt('refiner_task', 'expected_output',
                                        tasks),
            async_execution=False,
            output_file="/o/refined_thoughts.txt",
            agent=self.refinor,
        )
        crew = Crew(agents=[self.refinor], tasks=[second_shot])
        result = crew.kickoff()
        return result
    
    def make_conversational(self, second_attempt):
        final_attempt = Task(
            description=get_task_prompt('conversationalist_task', 'description',
                                        tasks, query=self.query, 
                                        second=second_attempt),
            expected_output=get_task_prompt('conversationalist_task', 'description',
                                        tasks),
            async_execution=False,
            output_file="/o/final_thoughts.txt",
            agent=self.conversationalist,
        )
        crew = Crew(agents=[self.conversationalist], tasks=[final_attempt])
        result = crew.kickoff()
        return result
    