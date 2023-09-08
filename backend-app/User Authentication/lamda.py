#lamda function

# import boto3
# import json

# def lambda_handler(event, context):
#     query_params = event['queryStringParameters']
#     link_email = query_params['link_email']
#     question_no=query_params['question_no']
#     answer=query_params['answer']
#     status=fetch_items_with_condition(link_email,question_no,answer)

#     return {
#         'statusCode': 200,
#         'body': status
#     }


# def fetch_items_with_condition(email,question_no,userans):
#     dynamodb = boto3.resource('dynamodb',region_name='us-east-1')
#     table = dynamodb.Table('user-que-ans')
#     condition_expression = 'email = :value'
#     expression_attribute_values = {
#     ':value': email
#     }

#     response = table.scan(
#         FilterExpression=condition_expression,
#         ExpressionAttributeValues=expression_attribute_values
#     )

#     items = response['Items']
#     exactans=False
#     for item in items:
#         if(item['q_ans_'+question_no]==userans):
#             exactans=True
#     return exactans