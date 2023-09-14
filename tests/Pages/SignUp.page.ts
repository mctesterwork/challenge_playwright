import { expect, type Locator, type Page } from '@playwright/test';
import { request } from '@playwright/test';

export class SignUpPage {
    readonly page: Page;
    readonly firstName: string;
    readonly lastName: string;

    constructor(page: Page) {
        this.page = page;
        this.firstName = "Miguel";
        this.lastName = "Correa";
      }

    async signUpAPI(newEmail: string, newPass: string)
    {
        let apiContext = await request.newContext({baseURL: "https://thinking-tester-contact-list.herokuapp.com"});
        const newUser = await apiContext.post("/users", { data:{ firstName: this.firstName, lastName: this.lastName,email: newEmail, password: newPass } }
        );
        
    expect(newUser.ok()).toBeTruthy();
    }

    async updateCreds(credentialsFile, newEmail: string, newPass: string) {

        const { writeFile, readFile } = require("fs");
        readFile(credentialsFile, (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log(data)
            
            const parsedData = JSON.parse(data);
            
            // updating name in shipping_address
            parsedData.email = newEmail;
            parsedData.password = newPass;
            
            writeFile(credentialsFile, JSON.stringify(parsedData, null, 2), (err) => {
                if (err) {
                    console.log("Failed to write updated data to file");
                    return;
                }
                console.log("Updated file successfully");
            });
        });
    }
    
}