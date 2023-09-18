import { expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class ContactListPage {
  readonly page: Page;
  // Add / Update contacts locator definitions
  readonly addContactButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthdateInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly street1Input: Locator;
  readonly street2Input: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countryInput: Locator;
  readonly submitButton: Locator;
  // Deleting contact locators
  readonly allContacts: Locator;
  readonly firstNameSpan: Locator;
  readonly lastNameSpan: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly returnButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Adding / Updating contact locators
    this.addContactButton = page.getByRole("button", {name: "Add a New Contact"});
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.birthdateInput = page.getByPlaceholder("yyyy-MM-dd");
    this.emailInput = page.getByPlaceholder("example@email.com");
    this.phoneInput = page.getByPlaceholder("8005551234");
    this.street1Input = page.getByPlaceholder("Address 1");
    this.street2Input = page.getByPlaceholder("Address 2");
    this.cityInput = page.getByPlaceholder("City");
    this.stateInput = page.getByPlaceholder("State or Province");
    this.postalCodeInput = page.getByPlaceholder("Postal Code");
    this.countryInput = page.getByPlaceholder("Country");
    this.submitButton = page.getByRole("button", {name: "Submit"});
    // Deleting contact locators
    this.allContacts = page.locator("xpath=//tr[@class='contactTableBodyRow']");
    this.firstNameSpan = page.locator("xpath=//span[@id='firstName']");
    this.lastNameSpan = page.locator("xpath=//span[@id='lastName']");
    this.editButton = page.getByRole("button", {name: "Edit Contact"});
    this.deleteButton = page.getByRole("button", {name: "Delete Contact"});
    this.returnButton = page.getByRole("button", {name:"Return to Contact List"});
  }

  async goto() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/contactList');
  }

  async addContact(num: number): Promise<string[]> {
    let contactNames: string[] = [];
    for(let i=0; i < num; i++)
    {
      const newContact = await this.createRandomUser();
      await this.addContactButton.isVisible();
      await this.addContactButton.click();
      await this.firstNameInput.type(newContact.firstName);
      await this.lastNameInput.type(newContact.lastName);
      await this.birthdateInput.type(newContact.birthday);
      await this.emailInput.type(newContact.email);
      await this.phoneInput.type(newContact.phone);
      await this.street1Input.type(newContact.street1);
      await this.street2Input.type(newContact.street2);
      await this.cityInput.type(newContact.city);
      await this.stateInput.type(newContact.state);
      await this.postalCodeInput.type(newContact.zipCode);
      await this.countryInput.type(newContact.country);
      await this.submitButton.click();
      contactNames.push(newContact.firstName + ' ' + newContact.lastName);
    }
  return contactNames;
  }

  async AddContactAPI(num: number): Promise<string[]> {
    let contactNames: string[] = [];
    for(let i=0;i<num;i++)
    {
        // Our block of code to repeat
        const newContact = await this.createRandomUser();
        const newAPIContext = this.page.request;
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
        if (response.status() < 300)
        {
          const newContactFullName = newContact.firstName + ' ' + newContact.lastName;
          contactNames.push(newContactFullName);
        }
    }
    return contactNames;
  }

  async createRandomUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthday = faker.date.birthdate().toISOString().split('T')[0];
    const email = faker.internet.email({firstName, lastName});
    const phone = faker.phone.number('##########');
    const street1 = faker.location.streetAddress(false);
    const street2 = faker.location.secondaryAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const zipCode = faker.location.zipCode();
    const country = function () {let newCountry = faker.location.country(); if(newCountry.length <= 38){return newCountry} else {return newCountry.substring(0, 38)}}();
  
    return {
      firstName,
      lastName,
      birthday,
      email,
      phone,
      street1,
      street2,
      city,
      state,
      zipCode,
      country,
    };
  }

  async updateContact(newFirstName: string, newLastName: string) {
    const firstContact = await this.allContacts.first();
    await firstContact.click();
    // Enable editing by clicking the edit button
    await this.editButton.isVisible();
    await this.editButton.click();
    // Update first and last name
    const inputFirstName = await this.page.locator("xpath=//input[@id='firstName']")
    const inputLastName = await this.page.locator("xpath=//input[@id='lastName']");
    // Wait until values are displayed on the fields, if we don't wait they will be submitted as empty
    await expect.poll(async () => inputFirstName.inputValue()).toBeTruthy();
    // Make the updates
    await inputFirstName.clear();
    await inputFirstName.fill(newFirstName);
    await inputLastName.clear();
    await inputLastName.fill(newLastName);
    // Submit changes
    await this.submitButton.click();
    await expect.poll(async () => this.lastNameSpan.innerText()).toBeTruthy();
    const spanFirstName = await this.firstNameSpan.innerText();
    const spanLastName = await this.lastNameSpan.innerText();
    await expect(spanFirstName).toContain(newFirstName);
    await expect(spanLastName).toContain(newLastName);
  }

  async deleteAllContacts() {
    let contactNameList: string[] = [];
    await expect.poll(async () => this.allContacts.count()).toBeGreaterThan(0);
    const num = await this.allContacts.count();
    // TODO: Change to use a recursive function instead
    for(let i=0; i < num; i++)
    {
      await this.addContactButton.isVisible();
      await this.allContacts.first().click();
      await expect.poll(async () => this.lastNameSpan.innerText()).toBeTruthy();
      const firstName = await this.firstNameSpan.innerText();
      const lastName = await this.lastNameSpan.innerText();
      const contactName = firstName + ' ' + lastName;
      contactNameList.push(contactName);
      await this.deleteButton.focus();
      await this.deleteButton.click();
    }
    
    return contactNameList;
  }

  async searchContact(searchQuery: string): Promise<Locator> {
    const element = this.page.locator("xpath=//tr[@class='contactTableBodyRow']", {hasText: searchQuery});
    return element;
  }
}