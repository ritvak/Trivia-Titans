import boto3  # Import the AWS SDK for Python (Boto3)
import json  # Import the JSON library for handling JSON data

def lambda_handler(event, context):
    # Replace 'YourSnsTopicARN' with the ARN of your SNS topic
    sns_topic_arn = 'arn:aws:sns:us-east-1:798211948158:group_chat'

    # Extract the message from the event
    message_body = event['message']

    # Create an SNS client using Boto3
    sns_client = boto3.client('sns')

    try:
        # Publish the message to the SNS topic
        response = sns_client.publish(
            TopicArn=sns_topic_arn,
            Message=json.dumps({'default': json.dumps(message_body)}),
            MessageStructure='json'
        )

        # Create a success response
        success_response = {
            'statusCode': 200,
            'body': json.dumps('Message sent to SNS topic successfully!')
        }
        return success_response  # Return the success response
    
    except Exception as e:
        # Create an error response with the error message 
        error_response = {
            'statusCode': 500,
            'body': json.dumps('Error sending message to SNS topic: ' + str(e))
        }
        return error_response  # Return the error response

# The lambda_handler function is the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It publishes a message to an SNS topic using Boto3. Successful and error responses are created as appropriate.