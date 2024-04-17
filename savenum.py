import os.path
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Define the scopes for accessing Google Contacts
SCOPES = ['https://www.googleapis.com/auth/contacts']

def authenticate_google_contacts():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES,
                redirect_uri='http://localhost:8080/oauth2callback')
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Build the service object
    service = build('people', 'v1', credentials=creds)
    return service

def create_contact(service, name, phone_number):
    contact = {
        "names": [
            {"givenName": name}
        ],
        "phoneNumbers": [
            {"value": phone_number}
        ]
    }
    created_contact = service.people().createContact(body=contact).execute()
    print("Contact created: ", created_contact)

def main():
    service = authenticate_google_contacts()
    name = "John Doe"
    phone_number = "+1234567890"
    create_contact(service, name, phone_number)

if __name__ == '__main__':
    main()
