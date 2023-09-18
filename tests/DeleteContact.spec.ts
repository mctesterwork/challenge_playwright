import { test, expect, Locator, Page } from '@playwright/test';
import { ContactListPage } from './Pages/Contact-List.page';

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });


// We make sure to add data before the test
test.beforeEach(async ({ page }) => {
    const contactList = new ContactListPage(page);
    contactList.AddContactAPI(3);
  });

test("Delete single contact from API, then check UI", async ({page})=> {
    const contactList = new ContactListPage(page);
    await contactList.goto();
    // API request to get all contacts
    const apiContext = page.request;
    let response = await apiContext.get('https://thinking-tester-contact-list.herokuapp.com/contacts');
    const allContactsJson = await response.json();
    // Look for the first contact and delete it
    const firstContactID: string = allContactsJson[0]._id;
    const contactFullName: string = allContactsJson[0].firstName + ' ' + allContactsJson[0].lastName;
    // For debugging purposes
    console.log(contactFullName);
    response = await apiContext.delete('https://thinking-tester-contact-list.herokuapp.com/contacts/'+firstContactID)
    await expect(response.ok()).toBeTruthy();
    //Now check on the UI this contact doesn't exist anymore
    await page.reload();
    await expect(page.content()).not.toContain(contactFullName);
});

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