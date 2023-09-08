import json  # Import the JSON library to handle JSON data
import boto3  # Import the AWS SDK for Python (Boto3)

def lambda_handler(event, context):
    # Get the user ID from the event
    print(event)  # Print the event data for debugging purposes
    user_id = event['user_id']  # Extract the 'user_id' from the event
    if not user_id:
        return {
            'statusCode': 400,
            'body': json.dumps('User ID not provided in the request.')
        }

    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')  # Create a DynamoDB resource using Boto3 
    table = dynamodb.Table('user_progress')  # Get a reference to the 'user_progress' DynamoDB table

    try:
        # Query the DynamoDB table to get user details by ID
        response = table.get_item(Key={'user_id': user_id})  # Query the table using the provided user ID
        
        # Check if the item exists in the table
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps('User not found.')
            }

        # Return the user details as the response
        user_details = response['Item']  # Extract the user details from the response
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',  # Allow the Content-Type header
            },
            'body': user_details  # Return the retrieved user details as the response body
        }
        return user_details

    except Exception as e:
        print('Error:', e)  # Print the error message for debugging purposes
        return {
            'statusCode': 500,
            'body': json.dumps('An error occurred while retrieving user details.')
        }

# The lambda_handler function serves as the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It extracts the 'user_id' from the event, queries DynamoDB for user details, and handles different response cases.
# CORS headers are added to allow communication with any frontend, and exceptions are caught and logged.