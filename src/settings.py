import os
import google.generativeai as genai
from dotenv import load_dotenv
import time

load_dotenv()

SETTING_API_KEY = os.getenv('GOOGLE_API_KEY')

class SettingProfile:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def changeName(self, name):
        self.name = name
    
    def changeEmail(self, email):
        self.email = email

user = SettingProfile("Rodin Shokravi", "new@gmail.com")

userInput = input("Send a message to Gemini: ")


genai.configure(api_key=SETTING_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")
if (userInput != ''):
    isSettings = model.generate_content(f'''User Input: {userInput} \n
                                        Is the user input asking anything remotely related to settings? \n
                                        Respond with a yes or no.''')

if ('yes' in isSettings.text.lower()):
    settingsCategory = model.generate_content(f'''User Input: {userInput} \n
                                    Is the user input asking about the categories below: \n
                                    "email" or "name" \n
                                    Only respond with the category and nothing else. State email or name''')

    if ('name' in settingsCategory.text.lower()):
        newName = model.generate_content(f'''User Input: {userInput} \n
                                    What is the user's final name? Only include the final demand''')
        
        user.changeName(newName.text)
    
    elif ('email' in settingsCategory.text.lower()):
        newEmail = model.generate_content(f'''User Input: {userInput} \n
                                    What is the user's final email? Only include the final demand''')
        
        user.changeEmail(newEmail.text)

print(user.name)
print(user.email)



    
