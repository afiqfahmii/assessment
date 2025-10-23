import { Page } from '@playwright/test';
import { Employee } from '../models/Employee';
import { pimSelectors } from '../selectors/pim.selectors';

export class PIMPage {
  constructor(private page: Page) {}

  async gotoAddEmployeePage() {
    await this.page.click(pimSelectors.sidebar.pimButton);
    await this.page.click(pimSelectors.navbar.addEmployeeTab);
  }

  async addEmployee(employee: Employee) {
    await this.page.locator(pimSelectors.employeeForm.firstName).waitFor({ state: 'visible' });

    // Fill basic info
    await this.page.fill(pimSelectors.employeeForm.firstName, employee.firstName);
    await this.page.fill(pimSelectors.employeeForm.middleName, employee.middleName || '');
    await this.page.fill(pimSelectors.employeeForm.lastName, employee.lastName);

    // Fill Employee ID
    const empIdField = this.page.locator(pimSelectors.employeeForm.employeeId);
    await empIdField.fill('');
    await empIdField.fill(employee.employeeId);

    // Wait for loader to disappear
    await this.page.locator(pimSelectors.common.loader).waitFor({ state: 'detached', timeout: 20000 });

    // Enable login creation
    await this.page.locator(pimSelectors.employeeForm.createLoginToggle).click();
    await this.page.waitForTimeout(10000);

    // Fill login credentials
    const uniqueUser = `${employee.username}_${Date.now()}`;
    await this.page.fill(pimSelectors.employeeForm.username, uniqueUser);
    await this.page.fill(pimSelectors.employeeForm.password, employee.password);
    await this.page.fill(pimSelectors.employeeForm.confirmPassword, employee.password);

    // Save
    const saveBtn = this.page.locator(pimSelectors.employeeForm.saveButton);
    await saveBtn.click();

    // Wait for redirect or toast
    const result = await Promise.race([
      this.page.waitForURL(/viewPersonalDetails/, { timeout: 50000 }).then(() => 'redirect'),
      this.page.waitForSelector(pimSelectors.common.toast, { timeout: 50000 }).then(() => 'toast'),
    ]).catch(() => 'none');

    console.log(`After Save: ${result}, URL: ${await this.page.url()}`);
    return { result, username: uniqueUser };
  }

  async gotoEmployeeList() {
    await this.page.click(pimSelectors.sidebar.pimButton);
    await this.page.click(pimSelectors.navbar.employeeListTab);
    await this.page.waitForSelector('h5:has-text("Employee Information")');
  }

  async assignSupervisor(employeeName: string, supervisorName: string) {
    await this.page.fill('//label[text()="Employee Name"]/../following-sibling::div//input', employeeName);
    await this.page.waitForTimeout(1000);

    const firstOption = this.page.locator('div[role="option"]').first();
    if (await firstOption.isVisible()) await firstOption.click();

    await this.page.click('button:has-text("Search")');
    await this.page.waitForTimeout(1000);
    await this.page.locator('i.bi-pencil-fill').first().click();

    // await this.page.waitForTimeout(5000);
    // console.log(await this.page.content());

    await this.page.waitForSelector('h6:has-text("Personal Details")');
    await this.page.click('a:has-text("Report-to")');
    await this.page.click('button:has-text("Add")');

    await this.page.fill('//label[text()="Name"]/../following-sibling::div//input', supervisorName);
    await this.page.waitForTimeout(1000);
    await this.page.locator(`div[role="option"]:has-text("${supervisorName}")`).first().click();

    await this.page.click('//label[text()="Reporting Method"]/../following-sibling::div//i');
    await this.page.click('div[role="option"]:has-text("Direct")');
    await this.page.click('button:has-text("Save")');
    await this.page.waitForSelector(pimSelectors.common.toast);
  }
}
