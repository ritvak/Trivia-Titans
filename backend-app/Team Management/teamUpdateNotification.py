import boto3

def lambda_handler(event, context):
    sns = boto3.client('sns')
    
    try:
        # Process the incoming event from DynamoDB
        records = event['Records']

        # Loop through the records and extract information to create notification messages
        for record in records:
            if record['eventName'] == 'MODIFY':  # Check if the event is a MODIFY event
                # Get the old and new images from the DynamoDB event
                old_image = record['dynamodb']['OldImage']
                new_image = record['dynamodb']['NewImage']

                # Convert DynamoDB AttributeValues to Python types
                old_image = {k: v[list(v.keys())[0]] for k, v in old_image.items()}
                new_image = {k: v[list(v.keys())[0]] for k, v in new_image.items()}

                # Check if the isAdmin status has changed to True
                if not old_image.get('isAdmin', False) and new_image.get('isAdmin', False):
                    team_name = new_image['team_name']
                    email = new_image['email']
                    isAdmin = new_image['isAdmin']

                    # Construct the notification message for isAdmin status change
                    notification_message = f'Team: {team_name}, Email: {email}, isAdmin: {isAdmin}'
                    
                    if isAdmin:
                        # Add a custom message for becoming an admin
                        notification_message += "\nCongratulations! You are now an admin."

                    # Publish the notification to the SNS topic
                    sns.publish(
                        TopicArn='arn:aws:sns:us-east-1:818286248176:iviteUserSNS',  # Replace with your SNS topic ARN
                        Message=notification_message,
                        MessageAttributes={
                            'EventType': {
                                'DataType': 'String',
                                'StringValue': 'AdminStatusChange'  # Indicate the event type
                            }
                        }
                    )

    except Exception as e:
        print(f"Error: {str(e)}")
        raise e
