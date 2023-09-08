import boto3

def lambda_handler(event, context):
    # Retrieve the team name from the event data
    team_name = event['team_name']
    
    # Create a DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    try:
        # Retrieve the team game statistics from DynamoDB
        response = dynamodb.get_item(
            TableName='team_management_table',
            Key={
                'team_name': {'S': team_name}
            }
        )
        
        # Check if the item was found
        if 'Item' in response:
            item = response['Item']
            # Extract the relevant attributes
            games_played = int(item['Games Played']['N'])
            wins = int(item['Wins']['N'])
            losses = int(item['Losses']['N'])
            
            # Calculate win percentage
            win_percentage = (wins / games_played) * 100
            
            # Construct the response message
            message = f"Team: {team_name}\n"
            message += f"Games Played: {games_played}\n"
            message += f"Wins: {wins}\n"
            message += f"Losses: {losses}\n"
            message += f"Win Ratio Percentage: {win_percentage}%"
        else:
            message = f"Team '{team_name}' not found."
    except Exception as e:
        # Handle any errors that occurred during DynamoDB access
        message = f"An error occurred: {str(e)}"
    
    # Return the response message
    return {
        'statusCode': 200,
        'body': message
    }
