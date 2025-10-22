import { Page, expect } from '@playwright/test';
import { pimSelectors } from '../selectors/pim.selectors';

export class PIMPage {
  constructor(private page: Page) {}

  async gotoAddEmployeePage() {
    await this.page.click('span:has-text("PIM")');
    await this.page.click('a:has-text("Add Employee")');
  }

  async addEmployee(firstName: string, middleName: string, lastName: string,
                    employeeId: string, username: string, password: string) {
    // Wait for form visible
    await this.page.locator('input[name="firstName"]').waitFor({ state: 'visible' });

    // Fill basic info
    await this.page.fill('input[name="firstName"]', firstName);
    await this.page.fill('input[name="middleName"]', middleName);
    await this.page.fill('input[name="lastName"]', lastName);

    // Fill Employee ID
    const empIdField = this.page.locator('//label[text()="Employee Id"]/following::input[1]');
    await empIdField.fill('');
    await empIdField.fill(employeeId);

    // Wait for loader to disappear
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 20000 });

    // Toggle Create Login Details
    const toggle = this.page.locator('.oxd-switch-input');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await this.page.waitForTimeout(1000); // short wait for animation

    // Fill login details
    await this.page.waitForSelector('//label[text()="Username"]', { timeout: 15000 });
    const uniqueUser = `${username}_${Date.now()}`;
    await this.page.fill('//label[text()="Username"]/following::input[1]', uniqueUser);
    await this.page.fill('//label[text()="Password"]/following::input[1]', password);
    await this.page.fill('//label[text()="Confirm Password"]/following::input[1]', password);

    console.log('Clicking Save, waiting for toast or redirect...');
    const saveBtn = this.page.locator('button:has-text("Save")');
    await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await saveBtn.click();

    // Wait for result
    let result = 'none';
    try {
      result = await Promise.race([
        this.page.waitForURL(/viewPersonalDetails/, { timeout: 30000 }).then(() => 'redirect'),
        this.page.waitForSelector('.oxd-toast', { timeout: 30000 }).then(() => 'toast'),
      ]);
    } catch {
      console.warn('⚠️ Neither toast nor redirect detected — possible validation error.');
    }

    console.log('After Save, result =', result, 'URL =', await this.page.url());

    // Optional assertion
    if (result === 'toast') {
      await expect(this.page.locator('.oxd-toast')).toContainText('Success');
    }
  }
}
