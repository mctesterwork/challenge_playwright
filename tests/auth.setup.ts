import { test as setup, expect } from '@playwright/test';

const creds = require('./fixtures/credentials.json');
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post('https://thinking-tester-contact-list.herokuapp.com/users/login', {
    data: {
      'email': creds.email,
      'password': creds.password
    }
  });
  await request.storageState({ path: authFile });
});