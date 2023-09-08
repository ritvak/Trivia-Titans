import boto3  # Import the AWS SDK for Python (Boto3)
import json  # Import the JSON library to handle JSON data
import traceback  # Import the traceback module to print exception details

def lambda_handler(event, context):
    try:
        # Create a DynamoDB resource using Boto3, specify the region 
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        
        # Get a reference to the 'user_progress' DynamoDB table
        table = dynamodb.Table('user_progress')
        
        # Scan the entire table to retrieve all user info
        response = table.scan()
        
        # Check if any items are returned
        if 'Items' in response and len(response['Items']) > 0:
            # Return the list of user info with CORS headers
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # Replace * with your frontend URL for production use
                    'Content-Type': 'application/json',
                },
                'body': response['Items']  # Return the retrieved user info items
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # Replace * with your frontend URL for production use
                    'Content-Type': 'application/json',
                },
                'body': json.dumps({'message': 'No user info found'})  # Return a JSON message for no user info
            }
    except Exception as e:
        traceback.print_exc()  # Print the traceback to CloudWatch Logs
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Replace * with your frontend URL for production use
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'message': 'Internal server error'})  # Return a JSON message for internal error
        }

# The lambda_handler function is the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It interacts with the 'user_progress' DynamoDB table to retrieve user info and handles different response cases.
# CORS headers are added to allow communication with a specific frontend, and exceptions are caught and logged.