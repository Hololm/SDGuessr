from openai import OpenAI
import time
import os
from dotenv import load_dotenv


load_dotenv()

summary_assistant_id = "asst_rfKnEjtz2i25ZGFEMhCs8q0F"
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )


def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")


def create_thread_and_run(user_input, assistant_id):
    thread = client.beta.threads.create()
    run = submit_message(assistant_id, thread, user_input)
    return thread, run


# Pretty printing helper
def pretty_print(messages):
    print("# Messages")
    for m in messages:
        print(f"{m.role}: {m.content[0].text.value}") #  prints as user: assistant: format for readability
    print()


# Waiting in a loop
def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run


# New thread of transcript prompt for transcript assistant
thread, run = create_thread_and_run(
    "test", summary_assistant_id #  transcript sent as prompt to assistant
)

# Wait for Run 1 - Transcript Bot Prompt
run1 = wait_on_run(run, thread)
pretty_print(get_response(thread)) #  returns Ai-Gen summary