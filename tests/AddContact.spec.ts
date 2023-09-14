import { test, expect } from '@playwright/test';
import { ContactListPage } from './Pages/Contact-List.page';

// So that all our tests use the account that was logged using the API
const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });

// We repeat the steps of adding a user with each different user

test('Test adding contacts from the UI', async ({ page }) => {
  const contactList = new ContactListPage(page);
  await contactList.goto()
  const addedContacts = await contactList.addContact(10);
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("My Contacts");
  await expect(page).toHaveURL(/contactList/);

  // TODO: Replace this with an API request and check the names are in the response object
  await addedContacts.forEach((value) => { expect(page.getByText(value)).toBeVisible() })
  });

test('Test adding contacts from the API', async ({ page }) => {
  const contactList = new ContactListPage(page);
  const newContact = await contactList.createRandomUser();
  const newAPIContext = page.request;
  const response = await newAPIContext.post('https://thinking-tester-contact-list.herokuapp.com/contacts', {
    data: 
    {
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      birthdate: newContact.birthday,
      email: newContact.email,
      phone: newContact.phone,
      street1: newContact.street1,
      street2: newContact.street2,
      city: newContact.city,
      stateProvince: newContact.state,
      postalCode: newContact.zipCode,
      country: newContact.country
    }})
  console.log(response.status);
  await contactList.goto();
  
  const newContactFullName = newContact.firstName + ' ' + newContact.lastName;
  const newContactRow = await page.getByText(newContactFullName);
  await expect(newContactRow.isVisible()).toBeTruthy()
});
