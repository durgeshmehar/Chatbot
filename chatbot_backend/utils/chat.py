import os
from core.settings import settings
# from langchain.llms import OpenAI
from core.settings import PROJECT_DIR
from langchain_openai import OpenAI

os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY

llm = OpenAI(temperature=0.6)

def generate_chat_response(input_text):
    print("dir :" , PROJECT_DIR)
    # return "~~~ This is chat Respons\n"
    llm = OpenAI(temperature=0.6)
    return llm(input_text)