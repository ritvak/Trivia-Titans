import json
import boto3

def lambda_handler(event, context):
    try:
        email = event['email']
        team_name = event['team_name']
        # Assuming the email is passed as part of the event payload

        # Connect to your database (e.g., Amazon DynamoDB)
        dynamodb = boto3.resource('dynamodb')
        user_table = dynamodb.Table('User')  # Replace 'User' with your actual User table name

        # Update the isAdmin status in User table
        response = user_table.update_item(
            Key={'team_name': team_name, 'email': email},
            UpdateExpression='SET isAdmin = :isAdmin',
            ExpressionAttributeValues={':isAdmin': True}
        )

        # Check if the update was successful
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            return {
                'statusCode': 500,
                'body': json.dumps('Failed to update isAdmin status in User table')
            }

        return {
            'statusCode': 200,
            'body': json.dumps('isAdmin status updated successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
