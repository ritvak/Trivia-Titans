import boto3  # Import the AWS SDK for Python (Boto3)

def delete_all_items(table_name):
    # Create a DynamoDB resource using Boto3
    dynamodb = boto3.resource('dynamodb')
    
    # Get a reference to the specified DynamoDB table
    table = dynamodb.Table(table_name)

    try:
        # Initiate a scan operation to retrieve all items from the table  
        response = table.scan()

        # Use a batch_writer context manager for efficient batch deletion
        with table.batch_writer() as batch:
            # Iterate through each item and delete it using its 'questionId' as the key
            for item in response['Items']:
                batch.delete_item(Key={'questionId': item['questionId']})

        # Create a success response with appropriate headers and message
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',  # Allow the Content-Type header
            },
            'statusCode': 200,
            'body': 'Successfully deleted all items from the table.'
        }

        return response  # Return the success response

    except Exception as e:
        # If an exception occurs, create an error response with HTTP status code 500 and the error message
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }

def lambda_handler(event, context):
    table_name = 'QuizQuestions'  # Replace with your DynamoDB table name
    return delete_all_items(table_name)  # Call the delete_all_items function with the specified table name

# The lambda_handler function serves as the entry point for AWS Lambda, which can be triggered in an AWS environment.
# It invokes the delete_all_items function and returns its result.
