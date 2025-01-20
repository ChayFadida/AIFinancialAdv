import json
import os
import requests
from langchain.tools import tool
import html2text, re

class SearchTools():
  @tool("Search the internet")
  def search_internet(query):
      """Useful to search the internet
      about a a given topic and return relevant results"""
      top_result_to_return = 4
      url = "https://google.serper.dev/search"
      payload = json.dumps({"q": query})
      headers = {
          'X-API-KEY': os.environ['SERPER_API_KEY'],
          'content-type': 'application/json'
      }
      response = requests.request("POST", url, headers=headers, data=payload)
      # check if there is an organic key
      if 'organic' not in response.json():
        return "Sorry, I couldn't find anything about that, there could be an error with you serper api key."
      else:
        results = response.json()['organic']
        string = []
      for result in results[:top_result_to_return]:
          try:
              link_content = ""
              link = result['link']
              
              # Fetch the content of the link
              try:
                  link_response = requests.get(link, timeout=10)
                  link_response.raise_for_status()
                  h = html2text.HTML2Text()
                  h.ignore_links = False
                  link_content = h.handle(link_response.content.decode("utf-8"))
                  link_content = re.sub(r"[^a-zA-Z$0-9\s\n]", "", link_content)
                  link_content = link_content[:800]
              except requests.RequestException as e:
                  link_content = f"Failed to fetch content: {str(e)}"
              
              string.append('\n'.join([
                  f"Title: {result['title']}", 
                  f"Link: {link}",
                  f"Snippet: {result['snippet']}", 
                  f"Content: {link_content}",
                  "\n-----------------"
              ]))
          except KeyError:
              continue

      return '\n'.join(string)