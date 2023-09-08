import boto3
import json

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        team_name = event['team_name']
        email = event['email']

<<<<<<< HEAD
        table = dynamodb.Table('User') 

        # Delete the item with the specified team_name and email
=======
        table = dynamodb.Table('User')  

        
>>>>>>> main
        table.delete_item(Key={'team_name': team_name, 'email': email})

        return {
            'statusCode': 200,
            'body': 'User deleted successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Failed to delete user: ' + str(e)
        }
<<<<<<< HEAD


=======
>>>>>>> main
