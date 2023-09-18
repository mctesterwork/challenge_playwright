import { test, expect } from '@playwright/test';
import { ContactListPage } from './Pages/Contact-List.page';

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });

// We make sure to add data before the test
test.beforeEach(async ({ page }) => {
    const contactList = new ContactListPage(page);
    contactList.AddContactAPI(3);
  });

test("Update contact from the UI and validate update in API response", async ({ page }) => {
    const contactList = new ContactListPage(page);
    const newFirstName = 'Peter';
    const newLastName = 'Parker';
    await contactList.goto();
    await contactList.updateContact(newFirstName, newLastName);
    // Request all contacts from API
    const apiContext = page.request;
    const response = await apiContext.get('https://thinking-tester-contact-list.herokuapp.com/contacts');
    const jsonData = JSON.stringify(await response.json());
    // For debugging
    console.log(jsonData);
    // Validate new first and last name are in the API response
    await expect(jsonData).toContain(newFirstName);
    await expect(jsonData).toContain(newLastName);
});

test("Update contact from the API and then validate update in UI", async ({ page }) => {
    // Get new user information
    const contactList = new ContactListPage(page);
    const newContact = await contactList.createRandomUser();
    // API request to get all contacts
    const apiContext = page.request;
    let response = await apiContext.get('https://thinking-tester-contact-list.herokuapp.com/contacts');
    const allContactsJson = await response.json();
    const lastContactID: string = allContactsJson[allContactsJson.length-1]._id;

    response = await apiContext.patch('https://thinking-tester-contact-list.herokuapp.com/contacts/'+lastContactID, {
        data: {
            firstName: newContact.firstName,
            lastName: newContact.lastName
        }
    })
    const fullName = newContact.firstName + ' ' + newContact.lastName;
    console.log(fullName);
    await contactList.goto();
    const newContactRow = await page.getByText(fullName);
    await expect(newContactRow.isVisible()).toBeTruthy();
});