import json
import boto3

def lambda_handler(event, context):
    try:
        email = event['email']
        team_name = event['team_name']
<<<<<<< HEAD

        # Connect to dynamodb database
        dynamodb = boto3.resource('dynamodb')
        user_table = dynamodb.Table('User')  

        # Update user record in User table
        item = {
            'email': email,
            'invitation_status': 'accepted',
            'team_name': team_name,
            'isAdmin': True,
            'sender_receiver':"sender",
=======
        dynamodb = boto3.resource('dynamodb')
        reg_user_table = dynamodb.Table('RegUser')  
        user_table = dynamodb.Table('User')  

        response = reg_user_table.update_item(
            Key={'email': email},
            UpdateExpression='SET isAdmin = :isAdmin',
            ExpressionAttributeValues={':isAdmin': True}
        )

        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            return {
                'statusCode': 500,
                'body': json.dumps('Failed to update status in RegUser table')
            }

        item = {
            'email': email,
            'invitation_status': 'accepted',
            'team_name': team_name
>>>>>>> main
        }
        user_table.put_item(Item=item)

        return {
            'statusCode': 200,
<<<<<<< HEAD
            'body': json.dumps('User record inserted successfully')
=======
            'body': json.dumps('Status updated and data inserted successfully')
>>>>>>> main
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
