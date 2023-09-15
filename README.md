# Tech First Automation Challenge - Playwright

Note: When you pull the proyect, you can set your own credentials in the fixtures/credentials.json file, and then run the SignUp.spec.ts automated test so you can register your account through website API. That should generate the playwright/.auth/user.json file which will store session information for all your tests, and will be used for the global authentication test (auth.ts) that runs before each other test.

### Challenge requirements:
#### App under test: Thinking tester contact list app - URL: https://thinking-tester-contact-list.herokuapp.com/
#### Use case: Happy path testing
+ All fields must be used on at least one (1) iteration of the script
+ Minimum of 10 records must be added to the contact list
+ At least 1 record must be added through the use of the site’s API
+ Site’s user account (your account) must be created through the use of the site’s API
+ The script must combine the use of UI and API to manipulate / validate the data
+ All data entered through the UI must be parameterized and accessed from an external data source
+ There must exist within the project a search method to iterate through the table. The method should identify one value in a specific record by searching for the record through your choice of logic.

### Tests performed:
+ Login UI (Happy path)
+ Login API
+ SignUp through the API
+ Add Contact via UI, then validate through API
+ Add Contact via API, then validate UI
+ Update Contact via UI, then validate through API
+ Update Contact via API, then validate UI
+ Delete Contact via UI, then validate through API
+ Delete Contact via API, then validate through API
