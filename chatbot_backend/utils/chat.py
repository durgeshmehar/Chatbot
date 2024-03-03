import os
from core.settings import settings
# from langchain.llms import OpenAI
from core.settings import PROJECT_DIR
from langchain_openai import OpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

# os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY
os.environ['GOOGLE_API_KEY'] = settings.GOOGLE_API_KEY

# llm = OpenAI(temperature=0.6)
llm = ChatGoogleGenerativeAI(model="gemini-pro")

def generate_chat_response(input_text):
    # llm = OpenAI(temperature=0.6)
    # return llm(input_text)
    response = llm.invoke(input_text)
    return response.content
