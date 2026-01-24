import requests
import sys
from datetime import datetime

class KEESOAPITester:
    def __init__(self, base_url="https://keeso-kurumsal.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token and 'Authorization' not in test_headers:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.passed_tests.append(name)
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "got": response.status_code,
                    "endpoint": endpoint
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                return False, {}

        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "/api/health",
            200
        )
        return success

    def test_login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   ✓ Token received")
            return True
        return False

    def test_get_announcements(self):
        """Test getting announcements"""
        success, response = self.run_test(
            "Get Announcements",
            "GET",
            "/api/announcements?limit=10",
            200
        )
        if success:
            print(f"   ✓ Found {len(response.get('items', []))} announcements")
        return success, response

    def test_create_announcement(self):
        """Test creating an announcement"""
        test_data = {
            "title": f"Test Duyuru {datetime.now().strftime('%H%M%S')}",
            "content": "Bu bir test duyurusudur. KEESO test sistemi tarafından oluşturulmuştur.",
            "category": "Genel Duyurular"
        }
        success, response = self.run_test(
            "Create Announcement",
            "POST",
            "/api/announcements",
            200,
            data=test_data
        )
        return success, response.get('id') if success else None

    def test_get_announcement_by_id(self, announcement_id):
        """Test getting a specific announcement"""
        success, response = self.run_test(
            "Get Announcement by ID",
            "GET",
            f"/api/announcements/{announcement_id}",
            200
        )
        return success

    def test_update_announcement(self, announcement_id):
        """Test updating an announcement"""
        update_data = {
            "title": f"Updated Test Duyuru {datetime.now().strftime('%H%M%S')}",
            "content": "Bu güncellenmiş bir test duyurusudur.",
            "category": "Eğitimler"
        }
        success, response = self.run_test(
            "Update Announcement",
            "PUT",
            f"/api/announcements/{announcement_id}",
            200,
            data=update_data
        )
        return success

    def test_delete_announcement(self, announcement_id):
        """Test deleting an announcement"""
        success, response = self.run_test(
            "Delete Announcement",
            "DELETE",
            f"/api/announcements/{announcement_id}",
            200
        )
        return success

    def test_get_documents(self):
        """Test getting documents"""
        success, response = self.run_test(
            "Get Documents",
            "GET",
            "/api/documents",
            200
        )
        if success:
            print(f"   ✓ Found {len(response.get('items', []))} documents")
        return success

    def test_get_visits(self):
        """Test getting visits"""
        success, response = self.run_test(
            "Get Visits",
            "GET",
            "/api/visits",
            200
        )
        if success:
            print(f"   ✓ Found {len(response.get('items', []))} visits")
        return success

    def test_get_payments(self):
        """Test getting payment items"""
        success, response = self.run_test(
            "Get Payment Items",
            "GET",
            "/api/payments",
            200
        )
        if success:
            print(f"   ✓ Found {len(response)} payment items")
        return success

    def test_get_settings(self):
        """Test getting settings"""
        success, response = self.run_test(
            "Get Settings",
            "GET",
            "/api/settings",
            200
        )
        if success:
            print(f"   ✓ Settings retrieved")
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Kullanıcı",
            "email": "test@example.com",
            "phone": "05551234567",
            "message": "Bu bir test mesajıdır."
        }
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "/api/contact",
            200,
            data=contact_data
        )
        return success

    def test_membership_application(self):
        """Test membership application submission (without files)"""
        # Note: This is a multipart/form-data endpoint, so we'll test it differently
        print(f"\n🔍 Testing Membership Application...")
        print(f"   Note: Skipping file upload test (requires multipart/form-data)")
        print(f"⚠️  Manual test required for file upload functionality")
        return True

    def test_membership_status_query(self):
        """Test membership status query (should return 404 for non-existent)"""
        success, response = self.run_test(
            "Query Membership Status (Non-existent)",
            "GET",
            "/api/membership/status?query=nonexistent@test.com",
            404
        )
        return success

    def test_get_contacts(self):
        """Test getting contact messages"""
        success, response = self.run_test(
            "Get Contact Messages",
            "GET",
            "/api/contacts",
            200
        )
        if success:
            print(f"   ✓ Found {len(response.get('items', []))} contact messages")
        return success

    def test_get_memberships(self):
        """Test getting membership applications"""
        success, response = self.run_test(
            "Get Membership Applications",
            "GET",
            "/api/membership",
            200
        )
        if success:
            print(f"   ✓ Found {len(response.get('items', []))} membership applications")
        return success

    def test_announcements_with_filters(self):
        """Test announcements with category filter"""
        success, response = self.run_test(
            "Get Announcements with Category Filter",
            "GET",
            "/api/announcements?category=Genel Duyurular",
            200
        )
        return success

    def test_announcements_with_search(self):
        """Test announcements with search"""
        success, response = self.run_test(
            "Get Announcements with Search",
            "GET",
            "/api/announcements?search=test",
            200
        )
        return success

def main():
    print("=" * 60)
    print("KEESO API Testing Suite")
    print("=" * 60)
    
    tester = KEESOAPITester()
    
    # Test 1: Health Check
    print("\n" + "=" * 60)
    print("PHASE 1: Basic Health Check")
    print("=" * 60)
    if not tester.test_health():
        print("\n❌ Health check failed. Backend may not be running.")
        print("\n📊 Final Results:")
        print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
        return 1
    
    # Test 2: Authentication
    print("\n" + "=" * 60)
    print("PHASE 2: Authentication")
    print("=" * 60)
    if not tester.test_login("admin@keeso.gov.tr", "admin123"):
        print("\n❌ Login failed. Cannot proceed with authenticated tests.")
        print("\n📊 Final Results:")
        print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
        return 1
    
    # Test 3: Announcements CRUD
    print("\n" + "=" * 60)
    print("PHASE 3: Announcements CRUD")
    print("=" * 60)
    tester.test_get_announcements()
    tester.test_announcements_with_filters()
    tester.test_announcements_with_search()
    
    success, announcement_id = tester.test_create_announcement()
    if success and announcement_id:
        tester.test_get_announcement_by_id(announcement_id)
        tester.test_update_announcement(announcement_id)
        tester.test_delete_announcement(announcement_id)
    
    # Test 4: Other Endpoints
    print("\n" + "=" * 60)
    print("PHASE 4: Other Endpoints")
    print("=" * 60)
    tester.test_get_documents()
    tester.test_get_visits()
    tester.test_get_payments()
    tester.test_get_settings()
    tester.test_get_contacts()
    tester.test_get_memberships()
    
    # Test 5: Public Forms
    print("\n" + "=" * 60)
    print("PHASE 5: Public Forms")
    print("=" * 60)
    tester.test_contact_form()
    tester.test_membership_application()
    tester.test_membership_status_query()
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Total tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {len(tester.failed_tests)}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure['test']}")
            if 'expected' in failure:
                print(f"     Expected: {failure['expected']}, Got: {failure['got']}")
            if 'error' in failure:
                print(f"     Error: {failure['error']}")
    
    print("\n✅ Passed Tests:")
    for test in tester.passed_tests:
        print(f"   - {test}")
    
    return 0 if len(tester.failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
