import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        response = dynamodb.scan(TableName='RegUser')  
        users = response['Items']

        cleaned_users = [{k: v[list(v.keys())[0]] for k, v in user.items()} for user in users]

        return {
            'statusCode': 200,
            'body': json.dumps(cleaned_users)
        }
    except Exception as e:
        print(str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error retrieving registered users'})
        }
