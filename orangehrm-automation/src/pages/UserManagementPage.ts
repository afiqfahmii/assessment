import { Page } from '@playwright/test';

export class UserManagementPage {
  constructor(private page: Page) {}

  async gotoUsersTab() {
    console.log('Navigating to Admin → User Management → Users...');

    const currentUrl = this.page.url();
    if (currentUrl.includes('/viewPersonalDetails')) {
      console.log('Currently on employee details — navigating back to dashboard...');
      await this.page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index',
        { waitUntil: 'domcontentloaded' }
      );
    }

    await this.page.waitForSelector('aside', { timeout: 20000 });

    const adminButton = this.page.locator('span:has-text("Admin")');
    await adminButton.waitFor({ state: 'visible', timeout: 5000 });
    await adminButton.click({ force: true });
    console.log('✅ Clicked Admin sidebar');

    await this.page.waitForSelector('nav.oxd-topbar-body-nav', { timeout: 20000 });

    const userMgmt = this.page.locator('nav.oxd-topbar-body-nav >> text=User Management');
    await userMgmt.waitFor({ state: 'visible', timeout: 20000 });

    await this.page.waitForTimeout(500);

    const dropdownIcon = this.page.locator(
      'nav.oxd-topbar-body-nav li:has-text("User Management") i.oxd-icon.bi-chevron-down'
    );
    if (await dropdownIcon.isVisible()) {
      await dropdownIcon.click({ force: true });
      console.log('📂 Expanded User Management dropdown');
    } else {
      console.log('⚠️ Dropdown icon not visible, continuing...');
    }

    const usersMenu = this.page.locator('a[role="menuitem"]:has-text("Users")');
    await usersMenu.waitFor({ state: 'visible', timeout: 20000 });
    await usersMenu.click({ force: true });

    await Promise.race([
      this.page.waitForSelector('h6:has-text("System Users")', { timeout: 20000 }),
      this.page.waitForSelector('button:has-text("Add")', { timeout: 20000 }),
    ]);

    console.log('✅ Navigated to Users page.');
  }

  async addSystemUser(employeeName: string, role: string, username: string, password: string) {
    console.log('Adding new system user...');

    const addButton = this.page.locator('button:has-text("Add")');
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click({ force: true });

    await this.page.waitForSelector('//label[text()="User Role"]', { timeout: 20000 });
    console.log('✅ Add User form is visible.');

    await this.page.locator('//label[text()="User Role"]/../following-sibling::div//i').click();
    await this.page.locator(`div[role="option"]:has-text("${role}")`).click();

    await this.page.locator('//label[text()="Status"]/../following-sibling::div//i').click();
    await this.page.locator('div[role="option"]:has-text("Enabled")').click();

    const empInput = this.page.locator('//label[text()="Employee Name"]/../following-sibling::div//input');
    await empInput.fill(employeeName);
    await this.page.waitForTimeout(1500);

    const firstOption = this.page.locator('div[role="option"]').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    } else {
      console.warn('⚠️ Employee not found in suggestion list.');
    }

    await this.page.fill('//label[text()="Username"]/../following-sibling::div//input', username);
    await this.page.fill('//label[text()="Password"]/../following-sibling::div//input', password);
    await this.page.fill('//label[text()="Confirm Password"]/../following-sibling::div//input', password);

    await this.page.locator('button:has-text("Save")').click();

    await this.page.waitForSelector('.oxd-toast', { timeout: 20000 });
    console.log('✅ System user successfully added.');
  }
}
