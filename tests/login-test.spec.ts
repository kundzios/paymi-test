import { test, expect } from '@playwright/test';
import { LoginPage } from './login-page.ts';

const emailErrorId = '#email-error .error-text';
const emailErrorTextBlank = 'Email can\'t be blank';
const emailErrorTextInvalid = 'Email is invalid';

const passwordErrorId = '#password-error .error-text';
const passwordErrorTextBlank = 'Password can\'t be blank';

const loginErrorClass = '.error-box__errors';
const loginErrorText = 'Invalid email address or password.';

test('blank login', async ({ page }) => {
	const loginPage = new LoginPage(page);
	await loginPage.goto();
	await loginPage.login();
	const emailError = page.locator(emailErrorId);
	const passwordError = page.locator(passwordErrorId);
	await expect(emailError).toBeVisible();
	await expect(emailError).toHaveText(emailErrorTextBlank);
	await expect(passwordError).toBeVisible();
	await expect(passwordError).toHaveText(passwordErrorTextBlank);
});