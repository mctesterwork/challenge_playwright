import { test, expect } from '@playwright/test';
import { LoginPage } from './Pages/LoginPage.page';

test('Test login from the UI', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("mctesting@vacofake.com", "MySamplePassword1");
  });