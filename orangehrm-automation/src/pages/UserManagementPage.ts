import { Page } from '@playwright/test';

export class UserManagementPage {
  constructor(private page: Page) {}

async gotoUsersTab() {
  console.log('Navigating to Admin → User Management → Users...');

  // If still on employee details page, go back to dashboard
  const currentUrl = this.page.url();
  if (currentUrl.includes('/viewPersonalDetails')) {
    console.log('Currently on employee details — navigating back to dashboard...');
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index',
      { waitUntil: 'domcontentloaded' }
    );
  }

  // Wait for sidebar
  await this.page.waitForSelector('aside', { timeout: 20000 });

  // Click "Admin" on sidebar
  const adminButton = this.page.locator('span:has-text("Admin")');
  await adminButton.waitFor({ state: 'visible', timeout: 20000 });
  await adminButton.click({ force: true });
  console.log('✅ Clicked Admin sidebar');

  // Wait for the top nav bar to appear
  await this.page.waitForSelector('nav.oxd-topbar-body-nav', { timeout: 20000 });

  // Wait explicitly for "User Management" text inside the top bar
  const userMgmt = this.page.locator('nav.oxd-topbar-body-nav >> text=User Management');
  await userMgmt.waitFor({ state: 'visible', timeout: 20000 });

  // Optional safety wait (some animations)
  await this.page.waitForTimeout(500);

  // Click the "User Management" dropdown if exists
  const dropdownIcon = this.page.locator(
    'nav.oxd-topbar-body-nav li:has-text("User Management") i.oxd-icon.bi-chevron-down'
  );
  if (await dropdownIcon.isVisible()) {
    await dropdownIcon.click({ force: true });
    console.log('📂 Expanded User Management dropdown');
  } else {
    console.log('⚠️ Dropdown icon not visible, continuing...');
  }

  // Click “Users” in dropdown
  const usersMenu = this.page.locator('a[role="menuitem"]:has-text("Users")');
  await usersMenu.waitFor({ state: 'visible', timeout: 20000 });
  await usersMenu.click({ force: true });

  // Wait for “System Users” page
  await Promise.race([
    this.page.waitForSelector('h6:has-text("System Users")', { timeout: 20000 }),
    this.page.waitForSelector('button:has-text("Add")', { timeout: 20000 }),
  ]);

  console.log('✅ Navigated to Users page.');
}


  async addSystemUser(employeeName: string, role: string, username: string, password: string) {
    console.log('Adding new system user...');

    // Click Add button
    const addButton = this.page.locator('button:has-text("Add")');
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click({ force: true });

    // Wait for form to appear
    await this.page.waitForSelector('//label[text()="User Role"]', { timeout: 20000 });
    console.log('✅ Add User form is visible.');

    // Select User Role
    await this.page.locator('//label[text()="User Role"]/../following-sibling::div//i').click();
    await this.page.locator(`div[role="option"]:has-text("${role}")`).click();

    // Select Status
    await this.page.locator('//label[text()="Status"]/../following-sibling::div//i').click();
    await this.page.locator('div[role="option"]:has-text("Enabled")').click();

    // Type Employee Name
    const empInput = this.page.locator('//label[text()="Employee Name"]/../following-sibling::div//input');
    await empInput.fill(employeeName);
    await this.page.waitForTimeout(1500);

    // Pick the first dropdown option
    const firstOption = this.page.locator('div[role="option"]').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    } else {
      console.warn('⚠️ Employee not found in suggestion list.');
    }

    // Fill Username + Password
    await this.page.fill('//label[text()="Username"]/../following-sibling::div//input', username);
    await this.page.fill('//label[text()="Password"]/../following-sibling::div//input', password);
    await this.page.fill('//label[text()="Confirm Password"]/../following-sibling::div//input', password);

    // Click Save
    await this.page.locator('button:has-text("Save")').click();

    // Wait for toast
    await this.page.waitForSelector('.oxd-toast', { timeout: 20000 });
    console.log('✅ System user successfully added.');
  }
}
