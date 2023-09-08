# Import necessary libraries
import json
import boto3

# Initialize the DynamoDB resource using boto3
dynamodb = boto3.resource('dynamodb')

# Specify the table name to be used in DynamoDB
table_name = 'team_management_table'

# Connect to the specified DynamoDB table
table = dynamodb.Table(table_name)


# Function to retrieve team statistics from DynamoDB
def get_team_stats(team_name):
    # Use the 'get_item' method to retrieve an item from the table with the given team_name
    response = table.get_item(Key={'team_name': team_name})
    # Extract the 'Item' from the response (if it exists)
    item = response.get('Item')
    # Return the item (or None if not found)
    return item


# Lambda function handler - Entry point for AWS Lambda
def lambda_handler(event, context):
    # Extract required data from the incoming 'event' object
    bot = event['bot']['name']                       # Bot name from lex
    slots = event['sessionState']['intent']['slots']  # Slots represent intent parameters
    intent = event['sessionState']['intent']['name']  # Name of the intent triggered

    # Extract the 'team_name' slot from the slots dictionary
    team_name_slot = slots['team_name']

    # Print the 'team_name_slot' for debugging purposes
    print("team_name_slot", team_name_slot)

    # Check if 'team_name_slot' is None (i.e., not provided by the user)
    if team_name_slot == None:
        # If 'team_name_slot' is None, generate a response message indicating that no data was found for the team
        response_message = f"No data found for team {team_name}"
    else:
        # If 'team_name_slot' is not None, extract the original value of the team name provided by the user
        team_name = slots['team_name']['value']['originalValue']
    
        # Call the 'get_team_stats' function to retrieve the team statistics from DynamoDB
        team_data = get_team_stats(team_name)

        # Check if 'team_data' exists (i.e., if the team is found in DynamoDB)
        if team_data:
            # If 'team_data' exists, retrieve the relevant statistics from the item
            wins = team_data.get('Wins', 'N/A')          # Retrieve 'Wins' attribute, set to 'N/A' if not found
            losses = team_data.get('Losses', 'N/A')      # Retrieve 'Losses' attribute, set to 'N/A' if not found
            games_played = team_data.get('Games_Played', 'N/A')  # Retrieve 'Games_Played' attribute, set to 'N/A' if not found
            # Construct the response message containing the team statistics
            response_message = f"Team {team_name} has played a total of {games_played} games, has won {wins} games, and has lost {losses} games!"
    
    # Create the final response object to be returned by the Lambda function
    response = {
        "sessionState": {
            "dialogAction": {
                "type": "Close"  # Indicates that the session should be closed after this response
            },
            "intent": {
                "name": intent,  # Include the original intent name in the response
                "slots": slots,  # Include the original slots in the response
                "state": "Fulfilled"  # Indicates that the intent has been fulfilled
            }
        },
        "messages": [
            {
                "contentType": "PlainText",  # Specify that the content type of the response is plain text
                "content": response_message  # Include the constructed response message in the response
            }
        ]
    }
    # Return the final response object
    return response
