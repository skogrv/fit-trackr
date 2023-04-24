import unittest
from base_test import BaseTestCase
from app.auth.forms import LoginForm, RegistrationForm


class TestRegisterForm(BaseTestCase):
    def test_validate_success_register_form(self):
        form = RegistrationForm(username="testing1", password="testing", confirm="testing")
        self.assertTrue(form.validate())

    def test_validate_invalid_password_format(self):
        form = RegistrationForm(username="testing1", password="testing", confirm="")
        self.assertFalse(form.validate())

    def test_validate_username_already_registered(self):
        form = RegistrationForm(username="testing", password="testing", confirm="testing")
        self.assertFalse(form.validate())

class TestLoginForm(BaseTestCase):
    def test_validate_success_login_form(self):
        form = LoginForm(username="testing", password="testing", confirm="testing")
        self.assertTrue(form.validate())

    def test_validate_invalid_username_format(self):
        form = LoginForm(username="", password="testing", confirm="testing")
        self.assertFalse(form.validate())


if __name__ == "__main__":
    unittest.main()