import unittest
from base_test import BaseTestCase
from flask_login import current_user


class TestPublic(BaseTestCase):
    def test_home_route_requires_login(self):
        # Ensure main route requres logged in user
        response = self.client.get("/", follow_redirects=true)
        self.assertTrue(response.status_code == 200)
        self.assertIn(b"Please log in to access this page", response.data)

    def test_logout_route_requires_login(self):
        # Ensure logout route requires logged in user
        response = self.client.get("/logout", follow_redirects=True)
        self.assertIn(b"Please log in to access this page", response.data)


class TestLogging(BaseTestCase):
    def test_correct_login(self):
        # Ensure login behaves correctly with correct credentials
        with self.client:
            response = self.client.post(
                "/login",
                data=dict(username="testing", password="testing"),
                follow_redirects=True
            )
            self.assertTrue(current_user.username == "testing")
            self.assertTrue(current_user.is_active)
            self.assertTrue(response.status_code == 200)

    def test_logout_behaves_correctly(self):
        # Ensure logout behaves correctly with session
        with self.client:
            self.client.post(
                "/loging",
                data=dict(username="testing", password="testing"),
                follow_redirects=True
            )
            response = self.client.get("/logout", follow_redirects=True)
            self.assertIn(b"You were logged out.", response.data)
            self.assertFalse(current_user.is_active)


if __name__ == "__main__":
    unittest.main()
