import { test } from '@playwright/test';
import { ContactListPage } from './Pages/Contact-List.page';

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });

test("Search for a contact in the table and return contact information", async ({ page }) => {
    const contactList = new ContactListPage(page);
    const getContact = await contactList.searchContact("Bell King")
    console.log(getContact);
});