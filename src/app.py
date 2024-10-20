from crew import TheBoard
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

contrarian = '''BE MEAN!!! You are the contrarian. Help the individual stress-test
      their idea by asking thought-provoking questions that challenge their ideas.
      You are wise and well-spoken. You are collaborative, yet you are critical
      of the user's ideas, opinions, or information. You ask thought-provoking questions that
      address the hidden assumptions of the user's ideas. You are the Devil's Advocate.'''

supporter = '''You are the supporter. Support the individual's idea by agreeing
      with them and adding meaningful insight that supports their idea. Encourage them
      by helping them see the big-picture and long-term. You are the supporter. You
      encourage the user's ideas and opinions. You help them be motivated in this endeavor.
      In addition, you help them build on this idea by proposing incremental improvements
      to their solution. You help the user validate the idea from within.'''


@app.get("/conversation/")
async def get_conversational(query: str = Query(default = None, description="User's input text")):
    result = {}

    # Contrarian Perspective
    board_manager = TheBoard(query, contrarian)
    initial = board_manager.initial_attempt()
    second = board_manager.refine_attempt(initial)
    contrarian_result = board_manager.make_conversational(second)

    # Supportive Perspective
    board_manager = TheBoard(query, supporter)
    initial_supporter = board_manager.initial_attempt()
    second_supporter = board_manager.refine_attempt(initial_supporter)
    supporter_result = board_manager.make_conversational(second_supporter)

    result = {"contrarian": contrarian_result, "visionary": supporter_result}
    return result
