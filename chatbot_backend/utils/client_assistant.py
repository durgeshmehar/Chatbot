import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
 
client = OpenAI(
  api_key=os.environ.get("OPENAI_API_KEY"),
)

vector_store = client.beta.vector_stores.create(name="File Data")

assistant = client.beta.assistants.create(
  name="Document Assistant",
  instructions="You are a knowledgeable assistant that helps users with questions related to the content of uploaded PDF documents. Use your understanding of the text within the provided files to answer queries accurately and thoroughly.",
  model="gpt-4o",
  tools=[{"type": "file_search"}],
)

# Update the assistant to use the vector store
assistant = client.beta.assistants.update(
    assistant_id=assistant.id,
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)