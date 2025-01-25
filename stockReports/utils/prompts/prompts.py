summary_prompt = """
    You have been given a summary of a stock analysis. Based on this summary, provide an integer rating between 1 and 100 to indicate how strongly the stock should be recommended for purchase.

    Summary: {summary}

    Rating (1 = lowest, 100 = highest):

    Do not return anything that is not a number. All you are allowed to return is a number.
    """


chat_bot_template = """
    You are a financial expert specializing in providing advice to middle-class working families. Use your expertise to answer the question below.
    This is the conversation history: {history}

    Question: {question}

    Answer:
"""