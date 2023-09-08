import boto3  # Import the AWS SDK for Python (Boto3)
import json  # Import the JSON library for handling JSON data
import urllib.request  # Import urllib.request to make HTTP requests

# Create a DynamoDB resource using Boto3
dynamodb = boto3.resource('dynamodb')
table_name = 'QuizQuestions'  # Specify the name of the DynamoDB table

def map_response_to_dynamodb_item(api_question):
    # Map the API response to a DynamoDB item format 
    return {
        'questionId': api_question['id'],
        'Question': api_question['Question'],
        'correctAnswer': api_question['correctanswer'],
        'Options': api_question['Options'],
    }

def fetch_questions_from_api(api_url):
    # Fetch and parse questions data from the specified API URL
    with urllib.request.urlopen(api_url) as response:
        data = response.read()
        return json.loads(data)  # Parse the JSON data

def store_questions_in_dynamodb(questions):
    # Store questions in the specified DynamoDB table using batch_writer
    table = dynamodb.Table(table_name)
    with table.batch_writer() as batch:
        for question in questions:
            item = map_response_to_dynamodb_item(question)
            batch.put_item(Item=item)

def get_questions_from_dynamodb():
    # Retrieve all questions from the DynamoDB table
    table = dynamodb.Table(table_name)
    response = table.scan()
    return response['Items']  # Return the retrieved items

def lambda_handler(event, context):
    try:
        print(event)  # Print the incoming event for debugging
        api_url = f'https://us-central1-tagging-392002.cloudfunctions.net/getQuestionsByDifficulty?difficulty={event["difficulty"]}'
        
        # Fetch questions from the specified API URL
        questions_from_api = fetch_questions_from_api(api_url)
        print(api_url)

        # Store the fetched questions in DynamoDB
        store_questions_in_dynamodb(questions_from_api)

        # Fetch the stored questions from DynamoDB
        questions_from_dynamodb = get_questions_from_dynamodb()

        # Transform the questions to the expected frontend format
        transformed_questions = []
        for question in questions_from_dynamodb:
            options = question['Options']
            transformed_question = {
                'question': question['Question'],
                'options': options,
                'correctAnswer': question['correctAnswer']
            }
            transformed_questions.append(transformed_question)
        
        # Create the response with CORS headers and transformed questions
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',  # Allow the Content-Type header
            },
            'body': transformed_questions
        }
        
        return transformed_questions  # Return the transformed questions as the Lambda function result
    
    except Exception as e:
        print('Error:', e)  # Print the error message for debugging
        return {
            'statusCode': 500,
            'body': 'An error occurred while fetching, storing, or transforming questions.',
        }

# The lambda_handler function is the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It fetches, stores, and transforms questions from an API and DynamoDB, and handles different response cases.
# CORS headers are added to allow communication with any frontend, and exceptions are caught and logged.