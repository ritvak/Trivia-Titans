import json  # Import the JSON library for handling JSON data
import boto3  # Import the AWS SDK for Python (Boto3)
from decimal import Decimal  # Import the Decimal class from the decimal module

# Define a custom JSON encoder to handle Decimal objects
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return int(o)  # Convert Decimal to int for serialization
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):
    # Extract the data from the event 
    user_id = event.get('user_id')
    wins = event.get('wins')
    losses = event.get('losses')
    total_points = event.get('total_points')
    
    # Validate that the required data is present in the event
    if not user_id or (wins is None and losses is None and total_points is None):
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid input data. Please provide user_id and at least one of wins, losses, or total_points.')
        }
    
    # Initialize the DynamoDB client using Boto3
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('user_progress')  # Replace 'YourTableName' with the name of your DynamoDB table
    
    try:
        # Build the update expression and expression attribute values for the update operation
        update_expression = 'SET '
        expression_attribute_values = {}
        
        if wins is not None:
            update_expression += 'wins = wins + :wins, '
            expression_attribute_values[':wins'] = wins
        
        if losses is not None:
            update_expression += 'losses = losses + :losses, '
            expression_attribute_values[':losses'] = losses
        
        if total_points is not None:
            update_expression += 'total_points = total_points + :total_points, '
            expression_attribute_values[':total_points'] = total_points
        
        update_expression += 'games_played = games_played + :games_played'
        expression_attribute_values[':games_played'] = 1
        
        # Perform the update operation on the DynamoDB table
        response = table.update_item(
            Key={'user_id': user_id},
            UpdateExpression=update_expression.strip(', '),  # Remove trailing comma and space
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='ALL_NEW'
        )

        # Serialize the response using the custom DecimalEncoder for Decimal objects
        serialized_response = json.dumps(response['Attributes'], cls=DecimalEncoder)

        return {
            'statusCode': 200,
            'body': serialized_response
        }

    except Exception as e:
        print('Error:', e)
        return {
            'statusCode': 500,
            'body': json.dumps('An error occurred while updating the user data.')
        }

# The lambda_handler function is the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It updates user data in a DynamoDB table based on the input event and handles different response cases.
# DecimalEncoder is used to serialize Decimal objects properly in the response.