import { expect, type Locator, type Page } from '@playwright/test';


export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
  
    constructor(page: Page) {
      this.page = page;
      this.emailInput = page.getByPlaceholder("Email");
      this.passwordInput = page.getByPlaceholder("Password");
      this.submitButton = page.getByRole("button", {name: "Submit"});
    }
  
    async goto() {
      await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
      await this.page.context().clearCookies();
    }
  
    async login(email: string, password: string) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click()
      await expect(this.page).toHaveTitle("My Contacts");
      await expect(this.page.getByRole("button", {name: "Logout"})).toBeVisible();
      
    }    
}