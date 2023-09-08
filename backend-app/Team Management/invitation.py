import json
import boto3

dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')
lambda_client = boto3.client('lambda')

def lambda_handler(event, context):
    try:
        team_name = event['team_name']
        recipient_email = event['email']

<<<<<<< HEAD
        # Check if the email is already associated with the specified team
=======
>>>>>>> main
        if is_member_in_team(recipient_email, team_name):
            return {
                'statusCode': 200,
                'body': 'User already invited to the team'
            }

<<<<<<< HEAD
        # Store invitation details in DynamoDB
        store_invitation_details(recipient_email, team_name)

        # Send invitation notification using SNS
        send_invitation_notification(recipient_email, team_name)

        # Set CORS headers
        headers = {
            'Access-Control-Allow-Origin': '*', 
=======
        store_invitation_details(recipient_email, team_name)

        
        send_invitation_notification(recipient_email, team_name)

    
        headers = {
            'Access-Control-Allow-Origin': '*',  
>>>>>>> main
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST'
        }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': 'Invitation sent successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Failed to send invitation: ' + str(e)
        }

def is_member_in_team(email, team_name):
    table = dynamodb.Table('User')

<<<<<<< HEAD
    # Query the table to check if the email is already associated with the team
=======
>>>>>>> main
    response = table.query(
        KeyConditionExpression='#tn = :tn and #em = :em',
        ExpressionAttributeNames={'#tn': 'team_name', '#em': 'email'},
        ExpressionAttributeValues={':tn': team_name, ':em': email}
    )

    return len(response['Items']) > 0

def store_invitation_details(recipient_email, team_name):
    table = dynamodb.Table('User')
    
<<<<<<< HEAD
    # Define the item to be stored in DynamoDB
    item = {
        'team_name': team_name,
        'email': recipient_email,
        'invitation_status': 'pending', 
        'isAdmin':False,
        'sender_receiver':'receiver'
    }
    
    # Store the item in DynamoDB
    table.put_item(Item=item)

def send_invitation_notification(recipient_email, team_name):
    # Create a message for the invitation
    api_gateway_url = 'https://dbpr4shjf1.execute-api.us-east-1.amazonaws.com/default'  
=======
    item = {
        'team_name': team_name,
        'email': recipient_email,
        'invitation_status': 'pending'  
    }
    

    table.put_item(Item=item)

def send_invitation_notification(recipient_email, team_name):
    
    api_gateway_url = 'https://dbpr4shjf1.execute-api.us-east-1.amazonaws.com/default' 
>>>>>>> main
    api_gateway_url1 = 'https://jyzwuneck1.execute-api.us-east-1.amazonaws.com/default'
    message = f"You have been invited to join team '{team_name}'. "
    message += f"Click the link to accept the invitation: {api_gateway_url}/invitationResponse?email={recipient_email}&team_name={team_name} "
    message += f"Click the link to reject the invitation: {api_gateway_url1}/rejectInvitation?email={recipient_email}&team_name={team_name}"

<<<<<<< HEAD
    # Publish the invitation message to the SNS topic
=======
>>>>>>> main
    sns.publish(
        TopicArn='arn:aws:sns:us-east-1:818286248176:iviteUserSNS',
        Message=message,
        Subject='Invitation to join a team'
    )
