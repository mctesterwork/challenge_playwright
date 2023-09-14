import { test, expect, Locator, Page } from '@playwright/test';
import { ContactListPage } from './Pages/Contact-List.page';

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });

test("Delete all visible contacts and check the API response", async ({ page }) => {
    const contactList = new ContactListPage(page);
    // Make sure to accept each confirmation dialog when deleting
    page.on('dialog', dialog => dialog.accept());
    
    await contactList.goto();
    const deletedNames = await contactList.deleteAllContacts();
    console.log(deletedNames);

    // Set API context with storage state TODO: Fix not authenticating
    const requestContext = await page.request;
    const response = await requestContext.fetch('https://thinking-tester-contact-list.herokuapp.com/contacts');
    // debug
    console.log(response.status(), await response.json())
    deletedNames.forEach((name) => {
        expect(response.json()).not.toContain(name);
    })
});