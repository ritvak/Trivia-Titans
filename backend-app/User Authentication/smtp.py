from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

def send_email(receiver_email, subject, message):
    # SMTP server configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587  # Update with the appropriate port number
    smtp_username = 'zamanfz.z@gmail.com'
    smtp_password = 'hfamtuhaqltlhlko'

    # Create a multipart message
    email_message = MIMEMultipart()
    email_message['From'] = smtp_username
    email_message['To'] = receiver_email
    email_message['Subject'] = subject

    # Attach the message to the email
    email_message.attach(MIMEText(message, 'plain'))

    # Connect to the SMTP server and send the email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username,smtp_password)
        server.send_message(email_message)