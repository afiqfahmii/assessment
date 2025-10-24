import { Page, expect } from "@playwright/test";
import { leaveSelectors } from "../selectors/leave.selectors";
import { LeaveRequest } from "../models/LeaveRequest";

export class LeaveListPage {
  constructor(private page: Page) {}

  async gotoLeaveListPage() {
    console.log("Navigating to Leave → Leave List...");
    await this.page.locator(leaveSelectors.sidebarLeave, { hasText: 'Leave' }).first().click();
    await this.page.waitForSelector("nav.oxd-topbar-body-nav");
    await this.page.locator(leaveSelectors.tabLeaveList).click();
    await this.page.waitForSelector(leaveSelectors.headerLeaveList);
  }

  async searchEmployeeLeave(leave: LeaveRequest) {
    console.log(`Searching leave for ${leave.employeeName}...`);
    await this.page.locator(leaveSelectors.employeeNameInput).fill(leave.employeeName);
    await this.page.waitForTimeout(2000);
    await this.page.locator('div[role="option"]').first().click();

    await this.page.click(leaveSelectors.leaveTypeDropdown);
    await this.page.locator(`div[role="option"]:has-text("${leave.leaveType}")`).click();

    await this.page.locator(leaveSelectors.searchButton).click();
    await this.page.waitForSelector(leaveSelectors.tableBody);
  }

  async approveLeave(employeeName: string) {
    console.log(`Approving leave for ${employeeName}...`);
    const row = this.page.locator(
      `//div[contains(@class,"oxd-table-row")]//div[normalize-space(text())="${employeeName}"]/ancestor::div[contains(@class,"oxd-table-row")]`
    );
    await row.first().waitFor({ state: "visible" });
    const approveBtn = row.locator(leaveSelectors.approveButton);
    await approveBtn.first().scrollIntoViewIfNeeded();
    await approveBtn.first().click({ force: true });
    await this.page.waitForSelector(leaveSelectors.toastMessage);
    await expect(this.page.locator(leaveSelectors.toastMessage)).toContainText("Success");
  }

  async verifyApprovedStatus(employeeName: string) {
    const approvedRow = this.page.locator(
      `//div[contains(@class,"oxd-table-row")]//div[contains(text(),"${employeeName}")]/ancestor::div[contains(@class,"oxd-table-row")]//div[contains(text(),"Approved")]`
    );
    await expect(approvedRow.first()).toBeVisible({ timeout: 15000 });
  }
}
