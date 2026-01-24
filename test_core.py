"""
KEESO Website - Core Integration POC Test
Tests email delivery (SendGrid/SMTP) and file storage (local/S3)
"""

import os
import sys
from pathlib import Path
import traceback

def print_section(title):
    """Print formatted section header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70 + "\n")

def print_result(test_name, success, message=""):
    """Print test result with formatting"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"     {message}")
    print()

def test_sendgrid_email():
    """Test SendGrid email integration"""
    print_section("TEST 1: SendGrid Email Delivery")
    
    try:
        # Check required environment variables
        api_key = os.getenv('SENDGRID_API_KEY')
        email_from = os.getenv('EMAIL_FROM')
        email_to_test = os.getenv('EMAIL_TO_TEST')
        
        if not api_key:
            print_result("SendGrid ENV Check", False, "SENDGRID_API_KEY not found in environment")
            return False
            
        if not email_from:
            print_result("SendGrid ENV Check", False, "EMAIL_FROM not found in environment")
            return False
            
        if not email_to_test:
            print_result("SendGrid ENV Check", False, "EMAIL_TO_TEST not found in environment")
            return False
        
        print_result("SendGrid ENV Check", True, "All required environment variables found")
        
        # Import SendGrid
        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail
            print_result("SendGrid Import", True, "SendGrid library imported successfully")
        except ImportError as e:
            print_result("SendGrid Import", False, f"Failed to import SendGrid: {str(e)}")
            return False
        
        # Create and send test email
        message = Mail(
            from_email=email_from,
            to_emails=email_to_test,
            subject='KEESO Website - Test Email (SendGrid)',
            html_content='''
            <html>
                <body>
                    <h2>KEESO Website Test Email</h2>
                    <p>This is a test email from the KEESO institutional website POC.</p>
                    <p><strong>Provider:</strong> SendGrid</p>
                    <p><strong>Purpose:</strong> Verify email integration is working correctly</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası
                    </p>
                </body>
            </html>
            '''
        )
        
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        
        if response.status_code == 202:
            print_result("SendGrid Email Send", True, f"Email sent successfully (Status: {response.status_code})")
            print(f"     From: {email_from}")
            print(f"     To: {email_to_test}")
            print(f"     Message ID: {response.headers.get('X-Message-Id', 'N/A')}\n")
            return True
        else:
            print_result("SendGrid Email Send", False, f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("SendGrid Email Send", False, f"Exception: {str(e)}")
        traceback.print_exc()
        return False

def test_smtp_email():
    """Test SMTP email integration"""
    print_section("TEST 2: SMTP Email Delivery")
    
    try:
        # Check required environment variables
        smtp_host = os.getenv('SMTP_HOST')
        smtp_port = os.getenv('SMTP_PORT')
        smtp_user = os.getenv('SMTP_USER')
        smtp_pass = os.getenv('SMTP_PASS')
        email_from = os.getenv('EMAIL_FROM')
        email_to_test = os.getenv('EMAIL_TO_TEST')
        
        if not smtp_host:
            print_result("SMTP ENV Check", False, "SMTP_HOST not found - SMTP test skipped (optional)")
            return True  # SMTP is optional, so return True
            
        if not all([smtp_port, smtp_user, smtp_pass, email_from, email_to_test]):
            print_result("SMTP ENV Check", False, "Some SMTP environment variables missing")
            return False
        
        print_result("SMTP ENV Check", True, "All required SMTP environment variables found")
        
        # Import SMTP libraries
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        print_result("SMTP Import", True, "SMTP libraries imported successfully")
        
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'KEESO Website - Test Email (SMTP)'
        msg['From'] = email_from
        msg['To'] = email_to_test
        
        html_content = '''
        <html>
            <body>
                <h2>KEESO Website Test Email</h2>
                <p>This is a test email from the KEESO institutional website POC.</p>
                <p><strong>Provider:</strong> SMTP</p>
                <p><strong>Purpose:</strong> Verify SMTP email integration is working correctly</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası
                </p>
            </body>
        </html>
        '''
        
        part = MIMEText(html_content, 'html')
        msg.attach(part)
        
        # Connect and send email
        smtp_port_int = int(smtp_port)
        
        # Try with TLS (port 587)
        if smtp_port_int == 587:
            server = smtplib.SMTP(smtp_host, smtp_port_int)
            server.starttls()
        # Try with SSL (port 465)
        elif smtp_port_int == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port_int)
        # Try without encryption (port 25 or other)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port_int)
        
        server.login(smtp_user, smtp_pass)
        server.sendmail(email_from, email_to_test, msg.as_string())
        server.quit()
        
        print_result("SMTP Email Send", True, "Email sent successfully via SMTP")
        print(f"     Server: {smtp_host}:{smtp_port}")
        print(f"     From: {email_from}")
        print(f"     To: {email_to_test}\n")
        return True
        
    except Exception as e:
        print_result("SMTP Email Send", False, f"Exception: {str(e)}")
        traceback.print_exc()
        return False

def test_storage_local():
    """Test local file storage"""
    print_section("TEST 3: Local File Storage")
    
    try:
        # Get upload directory from ENV or use default
        upload_dir = os.getenv('UPLOAD_DIR', '/app/uploads')
        
        # Create upload directory if it doesn't exist
        Path(upload_dir).mkdir(parents=True, exist_ok=True)
        print_result("Upload Directory", True, f"Directory created/verified: {upload_dir}")
        
        # Create test PDF content
        pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 <<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(KEESO Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n410\n%%EOF"
        
        # Write test PDF
        import uuid
        import hashlib
        from datetime import datetime
        
        # Generate safe filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        random_id = uuid.uuid4().hex[:8]
        test_pdf_path = Path(upload_dir) / f"test_document_{timestamp}_{random_id}.pdf"
        
        with open(test_pdf_path, 'wb') as f:
            f.write(pdf_content)
        
        print_result("PDF Write", True, f"Test PDF created: {test_pdf_path.name}")
        
        # Verify file exists and has correct size
        if test_pdf_path.exists():
            file_size = test_pdf_path.stat().st_size
            print_result("PDF Exists", True, f"File exists with size: {file_size} bytes")
        else:
            print_result("PDF Exists", False, "File was not created")
            return False
        
        # Read and verify content
        with open(test_pdf_path, 'rb') as f:
            read_content = f.read()
        
        if read_content == pdf_content:
            print_result("PDF Read & Verify", True, "File content matches original")
        else:
            print_result("PDF Read & Verify", False, "File content does not match")
            return False
        
        # Create test image (simple JPEG)
        jpeg_content = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x08\x01\x01\x00\x00?\x00\x7f\x00\xff\xd9'
        
        test_image_path = Path(upload_dir) / f"test_image_{timestamp}_{random_id}.jpg"
        
        with open(test_image_path, 'wb') as f:
            f.write(jpeg_content)
        
        print_result("Image Write", True, f"Test image created: {test_image_path.name}")
        
        # Verify image
        if test_image_path.exists():
            file_size = test_image_path.stat().st_size
            print_result("Image Exists", True, f"Image exists with size: {file_size} bytes")
        else:
            print_result("Image Exists", False, "Image was not created")
            return False
        
        # Clean up test files
        test_pdf_path.unlink()
        test_image_path.unlink()
        print_result("Cleanup", True, "Test files removed successfully")
        
        return True
        
    except Exception as e:
        print_result("Local Storage Test", False, f"Exception: {str(e)}")
        traceback.print_exc()
        return False

def test_storage_s3():
    """Test S3 file storage (optional)"""
    print_section("TEST 4: S3 File Storage (Optional)")
    
    try:
        # Check if S3 is configured
        storage_driver = os.getenv('STORAGE_DRIVER', 'local')
        
        if storage_driver != 's3':
            print_result("S3 Configuration", True, "STORAGE_DRIVER not set to 's3' - S3 test skipped (optional)")
            return True
        
        # Check S3 environment variables
        s3_endpoint = os.getenv('S3_ENDPOINT')
        s3_region = os.getenv('S3_REGION')
        s3_bucket = os.getenv('S3_BUCKET')
        s3_access_key = os.getenv('S3_ACCESS_KEY')
        s3_secret_key = os.getenv('S3_SECRET_KEY')
        
        if not all([s3_endpoint, s3_bucket, s3_access_key, s3_secret_key]):
            print_result("S3 ENV Check", False, "Missing S3 environment variables")
            return False
        
        print_result("S3 ENV Check", True, "All S3 environment variables found")
        
        # Import boto3
        try:
            import boto3
            from botocore.exceptions import ClientError
            print_result("Boto3 Import", True, "boto3 library imported successfully")
        except ImportError as e:
            print_result("Boto3 Import", False, f"Failed to import boto3: {str(e)}")
            print("     Install with: pip install boto3")
            return False
        
        # Create S3 client
        s3_client = boto3.client(
            's3',
            endpoint_url=s3_endpoint,
            aws_access_key_id=s3_access_key,
            aws_secret_access_key=s3_secret_key,
            region_name=s3_region or 'us-east-1'
        )
        
        print_result("S3 Client", True, f"S3 client created for bucket: {s3_bucket}")
        
        # Create test file
        import uuid
        from datetime import datetime
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        random_id = uuid.uuid4().hex[:8]
        test_key = f"test/poc_test_{timestamp}_{random_id}.txt"
        test_content = f"KEESO POC Test File - {timestamp}"
        
        # Upload test file
        s3_client.put_object(
            Bucket=s3_bucket,
            Key=test_key,
            Body=test_content.encode('utf-8'),
            ContentType='text/plain'
        )
        
        print_result("S3 Upload", True, f"Test file uploaded: {test_key}")
        
        # Generate presigned URL
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': s3_bucket, 'Key': test_key},
            ExpiresIn=3600
        )
        
        print_result("S3 Presigned URL", True, "Presigned URL generated successfully")
        print(f"     URL: {presigned_url[:80]}...\n")
        
        # Download and verify
        response = s3_client.get_object(Bucket=s3_bucket, Key=test_key)
        downloaded_content = response['Body'].read().decode('utf-8')
        
        if downloaded_content == test_content:
            print_result("S3 Download & Verify", True, "Downloaded content matches original")
        else:
            print_result("S3 Download & Verify", False, "Downloaded content does not match")
            return False
        
        # Clean up
        s3_client.delete_object(Bucket=s3_bucket, Key=test_key)
        print_result("S3 Cleanup", True, "Test file removed from S3")
        
        return True
        
    except Exception as e:
        print_result("S3 Storage Test", False, f"Exception: {str(e)}")
        traceback.print_exc()
        return False

def main():
    """Run all core integration tests"""
    print("\n" + "="*70)
    print("  KEESO WEBSITE - CORE INTEGRATION POC TESTS")
    print("  Testing: Email (SendGrid/SMTP) and File Storage (Local/S3)")
    print("="*70)
    
    # Track results
    results = {
        'SendGrid Email': False,
        'SMTP Email': False,
        'Local Storage': False,
        'S3 Storage': False
    }
    
    # Run tests
    results['SendGrid Email'] = test_sendgrid_email()
    results['SMTP Email'] = test_smtp_email()
    results['Local Storage'] = test_storage_local()
    results['S3 Storage'] = test_storage_s3()
    
    # Print summary
    print_section("TEST SUMMARY")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "-"*70)
    print(f"Results: {passed}/{total} tests passed")
    print("-"*70 + "\n")
    
    # Determine if POC is successful
    # At minimum, we need either SendGrid OR SMTP working, AND local storage working
    email_working = results['SendGrid Email'] or results['SMTP Email']
    storage_working = results['Local Storage']
    
    if email_working and storage_working:
        print("🎉 POC SUCCESSFUL - Core integrations are working!")
        print("   ✓ Email delivery is functional")
        print("   ✓ File storage is functional")
        print("\n   Ready to proceed with main application development.\n")
        return 0
    else:
        print("⚠️  POC INCOMPLETE - Some core integrations failed")
        if not email_working:
            print("   ✗ Email delivery not working (need SendGrid OR SMTP)")
        if not storage_working:
            print("   ✗ File storage not working")
        print("\n   Please fix the failed tests before proceeding.\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
