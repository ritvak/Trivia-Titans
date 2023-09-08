import boto3  # Import the AWS SDK for Python (Boto3)
import json  # Import the JSON library for handling JSON data

def lambda_handler(event, context):
    # Replace 'YourQueueURL' with the URL of your SQS queue
    queue_url = 'https://sqs.us-east-1.amazonaws.com/798211948158/message_queue'

    # Create an SQS client using Boto3
    sqs = boto3.client('sqs')
    processed_message = None  # Initialize the variable to store the processed message

    try:
        # Receive messages from the queue
        response = sqs.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=1,
            VisibilityTimeout=30
        )

        if 'Messages' in response:
            for message in response['Messages']:
                # Extract and process the message
                message_body = json.loads(message['Body'])['Message']
                processed_message = message_body

                # Delete the message from the queue to remove it from further processing
                sqs.delete_message(
                    QueueUrl=queue_url,
                    ReceiptHandle=message['ReceiptHandle']
                )
        else:
            print("No messages in the queue.")

        # Create a response with processed message 
        response = {
            'statusCode': 200,
            'body': json.dumps({'message': processed_message})
        }
        return response  # Return the response with processed message
    
    except Exception as e:
        print(f"Error processing messages: {str(e)}")  # Print the error message for debugging
        return {
            'statusCode': 500,
            'body': 'Error processing messages.'
        }

# The lambda_handler function is the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It receives and processes messages from an SQS queue, deletes processed messages, and returns a response.
# Exceptions are caught and logged, and appropriate responses are provided.