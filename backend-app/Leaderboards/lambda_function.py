import csv
import os
import boto3
from botocore.exceptions import ClientError
from google.cloud import storage
import json

# Define variables
bucketName = 'csci5410-leaderboard'
tableName = 'team_management_table'
secretName = 'gcp_cloud_storage'
regionName = 'us-east-1'

# Initialize DynamoDB resource and table
dynamodb = boto3.resource('dynamodb', region_name=regionName)
table = dynamodb.Table(tableName)

def fetch_data_from_dynamodb():
    try:
        # Retrieve data from DynamoDB table
        response = table.scan()
        return response['Items']
    except Exception as e:
        print('Error fetching data from DynamoDB:', e)
        raise e

def write_to_csv(data):
    csv_file = '/tmp/output.csv'

    fieldnames = [
        'team_name',
        'Games_Played',
        'Wins',
        'Losses'
    ]

    try:
        # Write data to a CSV file
        with open(csv_file, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)

        print(f'Data exported to {csv_file}.')
        return csv_file
    except Exception as e:
        print('Error writing to CSV file:', e)
        raise e

def get_secret():
    try:
        # Create a Secrets Manager client
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=regionName
        )

        # Retrieve the secret value
        get_secret_value_response = client.get_secret_value(
            SecretId=secretName
        )
    except ClientError as e:
        raise e

    # Decrypt the secret and return as JSON
    secret = get_secret_value_response['SecretString']
    return json.loads(secret)

def upload_to_gcs(csv_file):
    try:
        # Retrieve the GCS service account key
        service_account_key = get_secret()
        storage_client = storage.Client.from_service_account_info(service_account_key)
        
        # Upload the CSV file to Google Cloud Storage
        bucket = storage_client.bucket(bucketName)
        blob = bucket.blob(os.path.basename(csv_file))
        blob.upload_from_filename(csv_file)

        print(f'File {csv_file} uploaded to Google Cloud Storage.')
    except Exception as e:
        print('Error uploading to Google Cloud Storage:', e)
        raise e

def lambda_handler(event, context):
    try:
        # Fetch data from DynamoDB, write to CSV, and upload to GCS
        data_from_dynamodb = fetch_data_from_dynamodb()
        csv_file = write_to_csv(data_from_dynamodb)
        upload_to_gcs(csv_file)

        # Return a response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': 'Data exported and uploaded to GCS.'
        }
    except Exception as e:
        print('Error:', e)
        raise e
