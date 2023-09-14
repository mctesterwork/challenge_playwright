import { test, expect } from '@playwright/test';
import { SignUpPage } from './Pages/SignUp.page';

test("Sign up with stored credentials using the API", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const credsFile = './tests/fixtures/credentials.json';
    const newEmail = 'migueltesting13@playwright.to';
    const newPass = 'SimplePassword23';

    await signUpPage.signUpAPI(newEmail, newPass);
    await signUpPage.updateCreds(credsFile, newEmail, newPass);
});