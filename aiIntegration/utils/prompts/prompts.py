def getGradesStock(summary: str) -> str:
    return f"""I want you to analyze the following stock summary and provide a structured recommendation. Based on the summary, assign a percentage value for 'keep' (buy/hold), 'sell,' and 'hold' such that their total equals exactly 100. The percentages should reflect the sentiment and risk assessment derived from the summary.
            Consider technical indicators, market trends, and general stock performance when determining the best distribution. The recommendation should be returned in the following structured format:

            summary: A brief explanation of the stock's outlook.
            buy: A percentage (0-100) representing the likelihood of buying the stock.
            sell: A percentage (0-100) representing the likelihood of selling the stock.
            hold: A percentage (0-100) representing a neutral stance.
            Ensure that buy + sell + hold = 100 and that the distribution aligns with the insights provided in the summary.
            this is the summary: {summary}
            """

def getStockConfidence(summary: str) -> str:
    return f"""
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