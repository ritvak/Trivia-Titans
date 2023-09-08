import json
import boto3

# Create a DynamoDB client
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        # Get the team_name from the event (passed from the frontend)
        team_name = event['team_name']

        # DynamoDB scan operation to retrieve users with status "accepted" and matching team_name
        response = dynamodb.scan(
            TableName='User',  
            FilterExpression='#status = :accepted AND #tn = :team_name AND #sr = :receiver',
            ExpressionAttributeNames={
                '#status': 'invitation_status',
                '#tn': 'team_name',
                '#sr': 'sender_receiver'
            },
            ExpressionAttributeValues={
                ':accepted': {'S': 'accepted'},
                ':team_name': {'S': team_name},
                ':receiver': {'S': 'receiver'}
            }
        )
        users = response['Items']

        # Remove data type prefixes from user attributes
        cleaned_users = [{k: v[list(v.keys())[0]] for k, v in user.items()} for user in users]

        return {
            'statusCode': 200,
            'body': json.dumps(cleaned_users)
        }
    except Exception as e:
        print(str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error retrieving users with the given team_name'})
        }
