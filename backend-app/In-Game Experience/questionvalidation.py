import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('QuizQuestions')  # Replace 'YourTableName' with the actual name of your DynamoDB table

    # Extract the question ID and user's answer from the request body 
    question_id = event['questionId']
    user_answer = event['userAnswer']

    # Get the question item from DynamoDB
    response = table.get_item(Key={'questionId': question_id})
    question_item = response['Item']

    # Retrieve the correct answer from the question item
    correct_answer = question_item['correctAnswer']

    # Check if the user's answer matches the correct answer
    is_correct = user_answer == correct_answer

    # Return the validation result
    return is_correct
