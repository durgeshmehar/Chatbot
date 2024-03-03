import os
from core.settings import settings
from core.settings import PROJECT_DIR
from langchain_google_genai import ChatGoogleGenerativeAI

# from langchain_openai import OpenAI
# os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY

os.environ['GOOGLE_API_KEY'] = settings.GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(model="gemini-pro")

def generate_chat_response(input_text):
    # llm = OpenAI(temperature=0.6)
    # return llm(input_text)
    response = llm.invoke(input_text)
    return response.content
