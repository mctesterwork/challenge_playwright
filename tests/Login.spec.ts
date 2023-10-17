import { test, expect } from '@playwright/test';
import { LoginPage } from './Pages/LoginPage.page';

test('Test login from the UI', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("mctesting@vacofake.com", "MySamplePassword1");
    await expect(page).toHaveTitle("My Contacts");
    await expect(page.getByRole("button", {name: "Logout"})).toBeVisible();
  });