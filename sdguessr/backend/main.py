import time
import os
import json
import threading
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

class OpenAIClient:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
        self.lock = threading.Lock()  # Add a lock to ensure no two threads make calls simultaneously

    def submit_message(self, assistant_id, thread, user_message):
        self.client.beta.threads.messages.create(
            thread_id=thread.id, role="user", content=user_message
        )
        return self.client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant_id,
        )

    def get_response(self, thread):
        return self.client.beta.threads.messages.list(thread_id=thread.id, order="asc")

    def create_thread_and_run(self, user_input, assistant_id):
        thread = self.client.beta.threads.create()
        run = self.submit_message(assistant_id, thread, user_input)
        return thread, run

    def wait_on_run(self, run, thread):
        while run.status == "queued" or run.status == "in_progress":
            run = self.client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
            )
            time.sleep(0.5)
        return run


class JsonParser:
    @staticmethod
    def parse(messages):
        content = {"content": {"user": None, "assistant": None}}

        for m in messages:
            message_text = m.content[0].text.value

            if m.role == "user":
                content["content"]["user"] = message_text
            elif m.role == "assistant":
                content["content"]["assistant"] = message_text
        print(content)
        return content


def main():
    prompt = "help my water is dirty and filthy and my animals cant drink it! this happened near gila river!"

    api_key = os.getenv("OPENAI_API_KEY")
    assistant_id = os.getenv("OPENAI_ASSISTANT_ID")

    openai_client = OpenAIClient(api_key=api_key)

    # Emulating concurrent user requests
    thread, run = openai_client.create_thread_and_run(
        prompt, assistant_id
    )

    # Wait for Run 1
    run = openai_client.wait_on_run(run, thread)
    response_messages = openai_client.get_response(thread)

    return JsonParser.parse(response_messages)


if __name__ == "__main__":
    main()