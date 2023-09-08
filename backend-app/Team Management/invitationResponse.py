import json
import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        recipient_email = event['queryStringParameters']['email']
        team_name = event['queryStringParameters']['team_name']
        
<<<<<<< HEAD
        # Update invitation status to 'accepted' in DynamoDB
=======
>>>>>>> main
        update_invitation_status(recipient_email, team_name, 'accepted')
        
        return {
            'statusCode': 200,
            'body': 'Invitation accepted successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Failed to accept invitation: ' + str(e)
        }

def update_invitation_status(recipient_email, team_name, new_status):
    table = dynamodb.Table('User')

<<<<<<< HEAD
    # Scan the table to find the item with the specified recipient email and team_id
=======
>>>>>>> main
    response = table.scan(
        FilterExpression='email = :email AND team_name = :team_name',
        ExpressionAttributeValues={':email': recipient_email, ':team_name': team_name}
    )

    if response['Count'] > 0:
<<<<<<< HEAD
        # Update the item in DynamoDB
=======

>>>>>>> main
        response = table.update_item(
            Key={'email': recipient_email, 'team_name': team_name},
            UpdateExpression='SET invitation_status = :status',
            ExpressionAttributeValues={':status': new_status},
<<<<<<< HEAD
            ReturnValues='ALL_NEW' 
        )

        # Check if the update was successful
=======
            ReturnValues='ALL_NEW'  
        )

>>>>>>> main
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return response['Attributes']
        else:
            raise Exception('Failed to update invitation status')
    else:
        raise Exception('Invitation not found')
