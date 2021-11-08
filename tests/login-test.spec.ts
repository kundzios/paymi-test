import { test, expect } from '@playwright/test';
import { LoginPage } from './login-page.ts';

/******************************************************************/
/********* add valid credentials before starting the test *********/
/***/ const credentialsEmail = '';
/***/ const credentialsPassword = '';
/******************************************************************/
/******************************************************************/

const urlHome = 'https://staging.paymi.com';
const urlLogin = 'https://staging.paymi.com/users/sign_in';
const urlDashboard = 'https://staging.paymi.com/dashboard/accounts';

const passwordInputLocator = 'input#user_password';
const emailErrorLocator = '#email-error .error-text';
const passwordErrorLocator = '#password-error .error-text';
const loginErrorLocator = '.error-box__errors';

const emailErrorTextBlank = 'Email can\'t be blank';
const emailErrorTextInvalid = 'Email is invalid';
const passwordErrorTextBlank = 'Password can\'t be blank';
const loginErrorText = 'Invalid email address or password.';

test('redirect before login', async ({ page }) => {
	await page.goto(urlHome);
	await expect(page).toHaveURL(urlLogin);
	expect(await page.screenshot()).toMatchSnapshot('login-page.png');
});

test.describe('login attempts', () => {
	let page: Page;
	let loginPage: LoginPage;
	let emailError: Locator;
	let passwordError: Locator;
	
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		loginPage = new LoginPage(page);
		await loginPage.goto();
		emailError = page.locator(emailErrorLocator);
		passwordError = page.locator(passwordErrorLocator);
	});
	
	test.afterAll(async () => {
		await page.close();
	});
	
	test('blank login', async () => {
		await loginPage.login();
		await expect(emailError).toBeVisible();
		await expect(emailError).toHaveText(emailErrorTextBlank);
		await expect(passwordError).toBeVisible();
		await expect(passwordError).toHaveText(passwordErrorTextBlank);
	});
	
	test('invalid email without password', async () => {
		await loginPage.inputEmail('abc');
		await loginPage.inputPassword('');
		await loginPage.login();
		await expect(emailError).toBeVisible();
		await expect(emailError).toHaveText(emailErrorTextInvalid);
		await expect(passwordError).toBeVisible();
		await expect(passwordError).toHaveText(passwordErrorTextBlank);
	});
	
	test('blank email without password', async () => {
		await loginPage.inputEmail('');
		await loginPage.inputPassword('');
		await loginPage.login();
		await expect(emailError).toBeVisible();
		await expect(emailError).toHaveText(emailErrorTextBlank);
		await expect(passwordError).toBeVisible();
		await expect(passwordError).toHaveText(passwordErrorTextBlank);
	});
	
	test('blank email with password', async () => {
		await loginPage.inputEmail('');
		await loginPage.inputPassword('abc');
		await loginPage.login();
		await expect(emailError).toBeVisible();
		await expect(emailError).toHaveText(emailErrorTextBlank);
		await expect(passwordError).toBeHidden();
	});
	
	test('invalid email with password', async () => {
		await loginPage.inputEmail('abc');
		await loginPage.inputPassword('abc');
		await loginPage.login();
		await expect(emailError).toBeVisible();
		await expect(emailError).toHaveText(emailErrorTextInvalid);
		await expect(passwordError).toBeHidden();
	});
	
	test('valid email without password', async () => {
		await loginPage.inputEmail('abc@abc.com');
		await loginPage.inputPassword('');
		await loginPage.login();
		await expect(emailError).toBeHidden();
		await expect(passwordError).toBeVisible();
		await expect(passwordError).toHaveText(passwordErrorTextBlank);
	});
	
	test('wrong credentials login', async () => {
		let loginError = page.locator(loginErrorLocator);
		await loginPage.inputEmail('abc@abc.com');
		await loginPage.inputPassword('abc');
		await loginPage.login();
		await expect(loginError).toBeVisible();
		await expect(loginError).toHaveText(loginErrorText);
	});

	test('password visibility check', async () => {
		const passwordInput = page.locator(passwordInputLocator);
		await loginPage.inputPassword('abc');
		await loginPage.togglePasswordVisibility();
		await expect(passwordInput).toHaveAttribute('type', 'text');
		await loginPage.togglePasswordVisibility();
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});
	
	test('successful login', async () => {
		await loginPage.inputEmail(credentialsEmail);
		await loginPage.inputPassword(credentialsPassword);
		await loginPage.login();
		await expect(page).toHaveURL(urlDashboard);
	});
	
	test('redirect from login page', async () => {
		await page.goto(urlLogin);
		await expect(page).toHaveURL(urlDashboard);
	});
});