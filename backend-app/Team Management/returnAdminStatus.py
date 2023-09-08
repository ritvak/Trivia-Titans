import json
import boto3

def lambda_handler(event, context):
    try:
<<<<<<< HEAD
        team_name = event['team_name']
        email = event['email'] 

        # Connect to Amazon DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('User')  

        # Check if the email exists in the database
        response = table.get_item(Key={'team_name': team_name, 'email': email})

        if 'Item' in response:
            item = response['Item']
            if 'isAdmin' in item:
                isAdmin = item['isAdmin']
                if not isAdmin:
                    # Update the isAdmin status in the User table
                    table.update_item(
                        Key={'team_name': team_name, 'email': email},
                        UpdateExpression='SET isAdmin = :isAdmin',
                        ExpressionAttributeValues={':isAdmin': True}
                    )
                return {
                    'statusCode': 200,
                    'body': json.dumps({'isAdmin': isAdmin})
=======
        email = event['email'] 
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('RegUser')  

        
        response = table.get_item(Key={'email': email})

        if 'Item' in response:
            item = response['Item']
            if 'isAdmin' in item and item['isAdmin']:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'isAdmin': True})
                }
            else:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'isAdmin': False})
>>>>>>> main
                }
        else:
            return {
                'statusCode': 404,
<<<<<<< HEAD
                'body': json.dumps({'isAdmin': False})
=======
                'body': json.dumps('User not found')
>>>>>>> main
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
<<<<<<< HEAD

=======
>>>>>>> main
