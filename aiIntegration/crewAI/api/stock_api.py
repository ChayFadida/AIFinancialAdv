import requests
import os
class YahooFinanceAPI:
    @staticmethod
    def get_stock_price(symbol):
        url = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history'
        querystring = {
            "symbol": symbol,
            "interval": "5m",
            "diffandsplits": "false"
        }
        headers = {
            "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
            "x-rapidapi-key": os.getenv("YAHOO_API_KEY")
        }

        try:
            response = requests.get(url, headers=headers, params=querystring)
            response.raise_for_status()  # Raise an HTTPError for bad responses
            data = response.json()  # Parse the JSON response
            
            # Extract the regularMarketPrice
            regular_market_price = data.get("meta", {}).get("regularMarketPrice")
            if regular_market_price is not None:
                print(f"Regular Market Price: {regular_market_price}")
                return regular_market_price
            else:
                print("regularMarketPrice not found in the response.")
                return None
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None

# Example usage:
if __name__ == "__main__":

    history = YahooFinanceAPI.get_stock_price("AMZN")
    if history:
        print(history)
