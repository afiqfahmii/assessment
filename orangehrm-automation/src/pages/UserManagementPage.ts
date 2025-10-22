import { Page } from '@playwright/test';

export class UserManagementPage {
  constructor(private page: Page) {}

  // Step 1: Navigate to Admin → User Management → Users
async gotoUsersTab() {
  console.log('Navigating to Admin → User Management → Users...');

  // Click the sidebar "Admin"
  await this.page.click('span:has-text("Admin")');

  // Wait until the top bar loads
  await this.page.waitForSelector('nav.oxd-topbar-body-nav', { timeout: 10000 });

  // Click the dropdown next to "User Management"
  const dropdownIcon = this.page.locator('li:has-text("User Management") i.oxd-icon.bi-chevron-down');
  await dropdownIcon.first().click();

  // Now click "Users"
  const usersMenuItem = this.page.locator('a[role="menuitem"]:has-text("Users")');
  await usersMenuItem.click();
  await this.page.waitForSelector('button:has-text("Add")', { timeout: 15000 });

  console.log('✅ Navigated to Users page.');
}

  // Step 2: Add new system user
  async addSystemUser(employeeName: string, role: string, username: string, password: string) {
    console.log('Adding new system user...');

    // Click the "Add" button
    await this.page.click('button:has-text("Add")');

    // Wait for the Add User form to appear
    await this.page.waitForSelector('h6:has-text("Add User")', { timeout: 15000 });

    // Select User Role (ESS/Admin)
    await this.page.click('//label[text()="User Role"]/../following-sibling::div//i');
    await this.page.click(`div[role="option"]:has-text("${role}")`);

    // Select Status (Enabled)
    await this.page.click('//label[text()="Status"]/../following-sibling::div//i');
    await this.page.click('div[role="option"]:has-text("Enabled")');

    // Search and select Employee Name
    await this.page.fill('//label[text()="Employee Name"]/../following-sibling::div//input', employeeName);
    await this.page.waitForTimeout(1500); // small wait for suggestions to appear
    await this.page.click(`div[role="option"]:has-text("${employeeName}")`);

    // Fill Username
    await this.page.fill('//label[text()="Username"]/../following-sibling::div//input', username);

    // Fill Password and Confirm Password
    await this.page.fill('//label[text()="Password"]/../following-sibling::div//input', password);
    await this.page.fill('//label[text()="Confirm Password"]/../following-sibling::div//input', password);

    // Click Save
    console.log('Clicking Save button...');
    await this.page.click('button:has-text("Save")');

    // Wait for success toast or user list reload
    await this.page.waitForSelector('.oxd-toast', { timeout: 30000 });
    console.log('✅ User successfully added!');
  }
}
