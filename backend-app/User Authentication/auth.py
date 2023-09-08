import json
from flask import Flask, request, jsonify,session
from flask_cors import CORS
from flask_session import Session
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
import boto3
import random
import requests
from smtp import send_email
from urllib.parse import quote

app = Flask(__name__)
CORS(app)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

cred=credentials.Certificate('userauth-f78ef-firebase-adminsdk-6m3cw-225411dea7.json')
firebase_admin.initialize_app(cred)



@app.route('/invokelamda-2-factor', methods=['POST'])
def invokelamda_2_factors():
        status=False
        data = request.get_json()
        answer=data['answers']
        link_email=data['link_email']
        question_id=""
        user=""

        for key in answer.keys():
            question_id=key
          
        base_url ='https://et1j41hfbb.execute-api.us-east-1.amazonaws.com'
        endpoint_path = '/test/qna'
        query_params = {
            'link_email': link_email,
            'question_no': question_id,
            'answer':answer[question_id]
        }

        # Construct the query string with the query parameters
        query_string = '&'.join([f'{key}={value}' for key, value in query_params.items()])


        # Construct the URL with the query string
        url = f'{base_url}{endpoint_path}?{query_string}'
        
        lamda_response = requests.get(url)

        if lamda_response.status_code == 200:
            lamda_response_data = lamda_response.json()
            status=lamda_response_data
            user = auth.get_user_by_email(link_email)
        
        else:
            # Handle the case when the request was not successfu
            print("Error fetching response")

        response={
            'status':status ,
            'id':user.uid  
        }

        
        return jsonify(response)

@app.route('/invokelamda-fetch_user_info', methods=['POST'])
def invokelamda_fetch_user():
        userinfo=""
        data = request.get_json()
        user = auth.get_user(data['id'])
          
        base_url ='https://3l5y868f0j.execute-api.us-east-1.amazonaws.com'
        endpoint_path = '/fetch/user'
        query_params = {
            'email': user.email,
            'id': user.uid,
        }

        # Construct the query string with the query parameters
        query_string = '&'.join([f'{key}={value}' for key, value in query_params.items()])


        # Construct the URL with the query string
        url = f'{base_url}{endpoint_path}?{query_string}'
        
        lamda_response = requests.post(url)
   

        if lamda_response.status_code == 200:
            userinfo = lamda_response.json()
    
        
        else:
            # Handle the case when the request was not successfu
            print("Error fetching response")

        response={
            'userInfo':userinfo 
        }

        
        return jsonify(response)  


@app.route('/invokelamda-update_user_info', methods=['POST'])
def invokelamda_update_user():
        userinfo=""
        data = request.get_json()

        orginaldata=data['formData']

        base_url ='https://z7bx9q95s3.execute-api.us-east-1.amazonaws.com'
        endpoint_path ='/update/user_info'
        query_params = orginaldata
        # query_params = {
        #     'email': 'sdad',
        #     'id': 'sdsdd',
        # }

        # Construct the query string with the query parameters
        query_string = '&'.join([f'{key}={value}' for key, value in query_params.items()])


        # Construct the URL with the query string
        url = f'{base_url}{endpoint_path}?{query_string}'
        
        lamda_response = requests.post(url)
        print(lamda_response.json())
   

        if lamda_response.status_code == 200:
            userinfo = lamda_response.json()
    
        
        else:
            # Handle the case when the request was not successfu
            print("Error fetching response")

        response={
            'userInfo':userinfo 
        }

        
        return jsonify(response)  


@app.route('/get-questions', methods=['GET'])
def getTheQuestions():
    AllQuestions=requests.get('https://2ljbxzk0lb.execute-api.us-east-1.amazonaws.com/get/all_questions')
    return jsonify(AllQuestions.json())

@app.route('/get-one-question', methods=['GET'])
def getOneQuestion():
    oneQuestions=requests.get('https://litrbj35ld.execute-api.us-east-1.amazonaws.com/getOne/one_question')
    return jsonify(oneQuestions.json())

@app.route('/googleRegister', methods=['POST'])
def googleRegister():
    data = request.get_json()

    check=check_email_exists(data['email'])
    print(data)

    if check:
          
        print('new user')  
       
    else:
        userData = {
                    'user_id': data['user_id'],
                    'email': data['email'],
                    'name':data['name'],
                    'phone':data['phone']
                }
        insert_item_into_dynamodb(userData,'users')
       

    return jsonify({'status':check,'email':data['email']}),200

def check_email_exists(email):
    dynamodb =  boto3.client('dynamodb',region_name='us-east-1')
    table_name = 'users'  # Replace with your DynamoDB table name

    response = dynamodb.query(
        TableName=table_name,
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={
            ':email': {'S': email}
        }
    )

    items = response.get('Items', [])
    if(len(items) > 0):
        return True
    else:
        return False

@app.route('/userAnsers', methods=['POST'])
def userans():
        data = request.get_json()
        answer=data['answers']
        link_email=data['link_email']

        store_que_ans = {
                'email': link_email,
                 'q_ans_1':answer['1'],
                 'q_ans_2':answer['2'],
                 'q_ans_3':answer['3']
            }
        
        insert_item_into_dynamodb(store_que_ans,'user-que-ans')
        link=auth.generate_email_verification_link(link_email,action_code_settings=None, app=None)
        send_email(link_email,"please verify your email address",link)

        response={
            'status':True
        }
        
        
        return jsonify(response)



@app.route('/reset_password', methods=['POST'])
def reset_password():
        data = request.get_json()
        email=data['email']
        status=check_email_exists(email)

        if(status):
             link = auth.generate_password_reset_link(email,action_code_settings=None, app=None)
             send_email(email,"Reset your password",link)


        response={
            'status':status
        }
        
        
        return jsonify(response)


        
def insert_item_into_dynamodb(item_data,table):

    base_url ='https://0wolwf8dkf.execute-api.us-east-1.amazonaws.com'
    endpoint_path ='/store/qna_in_db'
    item_data['table']=table
    query_params = json.dumps(item_data)
    query_string = quote(query_params)

    url = f'{base_url}{endpoint_path}?json_data={query_string}'

    lamda_response = requests.get(url)
    print(lamda_response.json())

def fetch_items_with_condition(email,question_no,userans):
    dynamodb = boto3.resource('dynamodb',region_name='us-east-1')
    table = dynamodb.Table('user-que-ans')
    condition_expression = 'email = :value'
    expression_attribute_values = {
    ':value': email
    }

    response = table.scan(
        FilterExpression=condition_expression,
        ExpressionAttributeValues=expression_attribute_values
    )

    items = response['Items']
    exactans=False
    for item in items:
        if(item['q_ans_'+question_no]==userans):
            exactans=True
    return exactans


@app.route('/register', methods=['POST'])
def create_user_signup_with_email_varification():

    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    try:
        # Create a new user with the provided email and password
        user = auth.create_user(
            email=email,
            # name=name,
            password=password
        )

   

        userData = {
                'user_id':user.uid,
                'email': email,
                'name':name,
                'phone':"xxxxxxxx"
            }
        insert_item_into_dynamodb(userData,'users')


        
        # Return the user ID if required
        return jsonify({'message': 'Registration successful'})
    
    except Exception as e:
        print("Error creating user:", str(e))
        return jsonify({'message': 'Registration failed'})
    


@app.route('/login', methods=['POST'])
def login():
    api_key = "AIzaSyChgx8VID7OVGEdR-Y2pqAAZMKvgkPC1ss"
    data = request.get_json()
    password = data.get('password')
    email = data.get('email')
    id=0

 

    try:
        user = auth.get_user_by_email(email)
        print(user)
        if user.email_verified:
    
            url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
            payload = {
                "email": email,
                "password": password,
                "returnSecureToken": False
            }
        

            try:
                response = requests.post(url, json=payload)
                data = response.json()
                id=data['localId']
            

            

                if "error" in data:
                    mgs = data["error"]["message"]
                    # Return error response or handle the specific validation error
                    status=False
                else:
                    mgs="please verify your security question"
                    status=True
            

            except requests.exceptions.RequestException as e:
                print("Validation failed:", str(e))
                status=False
                # Return error response or handle the request exception
        else:
            status=False
            mgs="please verify your email first"
    except:
        status=False
        mgs="User not found "   

 
    return jsonify({'status': status,'message': mgs,'id':id})

@app.route('/logout', methods=['POST'])
def firebase_logout_by_user_id():
    api_key = "AIzaSyChgx8VID7OVGEdR-Y2pqAAZMKvgkPC1ss"
    logout_url = f'https://identitytoolkit.googleapis.com/v1/accounts:signOut?key={api_key}'

    data = request.get_json()
    user_id = data.get('user_id')

    payload = {
        'localId': user_id
    }

    try:
        response = requests.post(logout_url, json=payload)
        response_data = response.json()
        if 'error' in response_data:
            print(f"Error logging out: {response_data['error']['message']}")
        else:
            print("Logged out successfully.")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


    return jsonify({'status': True})
#-----------------------------------------------------------------------
# #profile 
# @app.route('/profileinfo', methods=['get'])
# def profileinfo():

#-------------------------------------------------------------------------

@app.route('/invokelamda-fetch_user_stat', methods=['POST'])
def invokelamda_fetch_stat():
        user_stat=""
        data = request.get_json()
        print(data)

        # # user = auth.get_user(data['id'])
          

        url ='https://jzz1rkmlyl.execute-api.us-east-1.amazonaws.com/dev/userprogress'
        query_params = {
            'user_id': data['id']
        }
        
        lamda_response = requests.get(url,json=query_params)
   

        if lamda_response.status_code == 200:
            user_stat = lamda_response.json()
            print(user_stat)
    
        
        else:
            # Handle the case when the request was not successfu
            print("Error fetching response")

        # response={
        #     'user_stat':user_stat 
        # }

        
        return jsonify(user_stat)



@app.route('/logout', methods=['POST'])
def firebase_logout_by_user_id():
    api_key = "AIzaSyChgx8VID7OVGEdR-Y2pqAAZMKvgkPC1ss"
    logout_url = f'https://identitytoolkit.googleapis.com/v1/accounts:signOut?key={api_key}'

    data = request.get_json()
    user_id = data.get('user_id')

    payload = {
        'localId': user_id
    }

    try:
        response = requests.post(logout_url, json=payload)
        response_data = response.json()
        if 'error' in response_data:
            print(f"Error logging out: {response_data['error']['message']}")
        else:
            print("Logged out successfully.")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


    return jsonify({'status': True})
#-----------------------------------------------------------------------
# #profile 
# @app.route('/profileinfo', methods=['get'])
# def profileinfo():

#-------------------------------------------------------------------------

@app.route('/get_all_user_stat', methods=['GET'])
def invokelamda_fetch_stat():
        all_user_stat=""
        data = request.get_json()
        url ='https://jzz1rkmlyl.execute-api.us-east-1.amazonaws.com/dev/userprogress'
        lamda_response = requests.get(url)
   
        if lamda_response.status_code == 200:
            all_user_stat = lamda_response.json()
            print(all_user_stat)
        else:
            # Handle the case when the request was not successfu
            print("Error fetching response")

        # response={
        #     'all_user_stat':all_user_stat 
        # }

        
        # return jsonify(all_user_stat)


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=80)

invokelamda_fetch_stat()
