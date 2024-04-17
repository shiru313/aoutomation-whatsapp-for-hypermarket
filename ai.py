import openai

openai.api_key = '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'

messages = [{"role": "system", "content": "You are an ai assistant. my name is shirfan am is working on YARA HYPER Market working time 10 am to 10 pm  am not free now but i will be free soon you can call me "}]

file_name = "message.txt"  # Change this to your file name
with open(file_name, 'r') as file:
    fromtxt = file.readline().strip()  # Read the first line of the file

message = fromtxt
if message:
    messages.append(
        {"role": "user", "content": message},
    )
    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages
    )

reply = chat.choices[0].message.content
print(f"-{reply}")
messages.append({"role": "assistant", "content": reply})
