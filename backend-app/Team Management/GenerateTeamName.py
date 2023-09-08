<<<<<<< HEAD
# Import necessary libraries
import random
import boto3

# Define two lists containing adjectives and animals
adjectives = ['Amazing', 'Brilliant', 'Clever', 'Dazzling', 'Energetic', 'Fantastic', 'Glorious', 'Happy', 'Incredible', 'Jolly']
animals = ['Cheetahs', 'Dolphins', 'Eagles', 'Falcons', 'Giraffes', 'Hawks', 'Jaguars', 'Kangaroos', 'Lions', 'Monkeys']

# Lambda function handler - Entry point for AWS Lambda
def lambda_handler(event, context):
    # Define a lambda function 'generate_team_name' that creates a random team name
    generate_team_name = lambda: random.choice(adjectives) + ' ' + random.choice(animals)

    # Generate a random team name using the 'generate_team_name' function
    team_name = generate_team_name()

    # Print the generated team name for debugging purposes
    print(team_name)

    # Configure DynamoDB resource with the specified region (us-east-1)
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

    # Specify the table name to be used in DynamoDB
    table_name = 'team_management_table'

    # Connect to the specified DynamoDB table
    table = dynamodb.Table(table_name)

    # Check if the generated team name already exists in the DynamoDB table
    response = table.get_item(Key={'team_name': team_name})
    while 'Item' in response:
        # If the team name already exists, generate a new team name and check again
        team_name = generate_team_name()
        response = table.get_item(Key={'team_name': team_name})

    # At this point, the 'team_name' is unique, so we put the item into the DynamoDB table
    table.put_item(Item={'team_name': team_name})


# """
# CODE 1 - GENERATING TEAM NAME USING CHATGPT
=======
# """
>>>>>>> main
# Referenced from: https://blog.enterprisedna.co/how-to-use-chatgpt-for-python/
# """

# import openai


# def team_name_generator(event, context):
#     # Set the OpenAI API key
#     openai.api_key = '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'

#     try:
#         # Define the prompt for generating a team name
#         chatgpt_prompt = "Generate an interesting and a unique team name for a quiz game."

#         # Send a request to OpenAI's text-davinci-003 model for generating a team name
#         response = openai.Completion.create(
#             engine="text-davinci-003",
#             prompt=chatgpt_prompt,
#             max_tokens=32,
#             temperature=0.8,
#             n=1,
#             stop=None,
#             timeout=10,
#         )
#         print(response)
#         # Extract the generated team name from the response
#         team_name = response.choices[0].text.strip()
#         print(team_name)
#         # Return the team name as the response
#         return {
#             'statusCode': 200,
#             'body': team_name
#         }

#     except Exception as e:
#         print("Error asking ChatGPT", e)
<<<<<<< HEAD
=======


import random
import boto3

adjectives = ['Amazing', 'Brilliant', 'Clever', 'Dazzling', 'Energetic', 'Fantastic', 'Glorious', 'Happy', 'Incredible', 'Jolly']
animals = ['Cheetahs', 'Dolphins', 'Eagles', 'Falcons', 'Giraffes', 'Hawks', 'Jaguars', 'Kangaroos', 'Lions', 'Monkeys']

def lambda_handler(event, context):
    generate_team_name = lambda: random.choice(adjectives) + ' ' + random.choice(animals)

    team_name = generate_team_name()
    print(team_name)

    # DynamoDB Configuration
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'team_management_table'
    table = dynamodb.Table(table_name)

    # Check if the team name already exists in the DynamoDB table
    response = table.get_item(Key={'team_name': team_name})
    while 'Item' in response:
        # Generate a new team name if the current one already exists
        team_name = generate_team_name()
        response = table.get_item(Key={'team_name': team_name})

    # Store the unique team name in DynamoDB
    table.put_item(Item={'team_name': team_name})
>>>>>>> main
