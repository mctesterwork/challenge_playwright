import { test, expect } from '@playwright/test';
import { SignUpPage } from './Pages/SignUp.page';

test("Sign up with new credentials using the API", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const credsFile = './tests/fixtures/credentials.json';
    const newEmail = await signUpPage.newEmail(300);
    const newPass = 'SimplePassword23';

    const newUser = await signUpPage.signUpAPI(newEmail, newPass);
    expect(newUser.ok()).toBeTruthy();
    await signUpPage.updateCreds(credsFile, newEmail, newPass);
});