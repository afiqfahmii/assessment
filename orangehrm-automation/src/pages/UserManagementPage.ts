import { Page } from '@playwright/test';

export class UserManagementPage {
  constructor(private page: Page) {}

  async gotoUsersTab() {
    await this.page.click('span:has-text("Admin")');
    await this.page.waitForSelector('nav.oxd-topbar-body-nav');
    await this.page.locator('li:has-text("User Management") i.oxd-icon.bi-chevron-down').first().click();
    await this.page.locator('a[role="menuitem"]:has-text("Users")').click();
    await this.page.waitForSelector('button:has-text("Add")');
  }

  async addSystemUser(employeeName: string, role: string, username: string, password: string) {
    await this.page.click('button:has-text("Add")');
    await this.page.waitForSelector('h6:has-text("Add User")');

    await this.page.click('//label[text()="User Role"]/../following-sibling::div//i');
    await this.page.click(`div[role="option"]:has-text("${role}")`);

    await this.page.click('//label[text()="Status"]/../following-sibling::div//i');
    await this.page.click('div[role="option"]:has-text("Enabled")');

    const empSearch = this.page.locator('//label[text()="Employee Name"]/../following-sibling::div//input');
    await empSearch.fill(employeeName.slice(0, 6));
    await this.page.waitForFunction(() => document.querySelectorAll('div[role="option"]').length > 0);
    await this.page.waitForTimeout(1000);
    await this.page.locator('div[role="option"]').first().click();

    await this.page.fill('//label[text()="Username"]/../following-sibling::div//input', username);
    await this.page.fill('//label[text()="Password"]/../following-sibling::div//input', password);
    await this.page.fill('//label[text()="Confirm Password"]/../following-sibling::div//input', password);

    await this.page.click('button:has-text("Save")');
    await this.page.waitForSelector('.oxd-toast', { timeout: 30000 });
  }
}
