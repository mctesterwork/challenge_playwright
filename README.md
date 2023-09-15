# Tech First Automation Challenge - Playwright

Note: When you pull the proyect, you can set your own credentials in the fixtures/credentials.json file, and then run the SignUp.spec.ts automated test so you can register your account through website API. That should generate the playwright/.auth/user.json file which will store session information for all your tests, and will be used for the global authentication test (auth.ts) that runs before each other test.

App under test: Thinking tester contact list app - URL: https://thinking-tester-contact-list.herokuapp.com/

Tests performed:
+ Login UI (Happy path)
+ Login API
+ SignUp through the API
+ Add Contact via UI, then validate through API
+ Add Contact via API, then validate UI
+ Update Contact via UI, then validate through API
+ Update Contact via API, then validate UI
+ Delete Contact via UI, then validate through API
+ Delete Contact via API, then validate through API
