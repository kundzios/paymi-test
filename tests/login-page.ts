import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
	readonly page: Page;
	readonly loginButton: Locator;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly visibilityToggle: Locator;
	
	constructor(page: Page) {
		this.page = page;
		this.loginButton = page.locator('#log_in');
		this.emailInput = page.locator('input#user_email');
		this.passwordInput = page.locator('input#user_password');
		this.visibilityToggle = page.locator('.toggle-password');
	}
	
	async goto() {
		await this.page.goto('https://staging.paymi.com/users/sign_in');
	}
	
	async login() {
		await this.loginButton.click();
	}
	
	async inputEmail(s: String) {
		await this.emailInput.fill(s);
	}
	
	async inputPassword(s: String) {
		await this.passwordInput.fill(s);
	}
	
	async togglePasswordVisibility() {
		await this.visibilityToggle.click();
	}
}