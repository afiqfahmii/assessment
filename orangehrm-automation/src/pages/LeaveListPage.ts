import { Page, expect } from "@playwright/test";
import { leaveSelectors } from "../selectors/leave.selectors";
import { pimSelectors } from '../selectors/pim.selectors';
import { LeaveRequest } from "../models/LeaveRequest";

export class LeaveListPage {
  constructor(private page: Page) {}

  async gotoLeaveListPage() {
    console.log("Navigating to Leave → Leave List...");
    await this.page
      .locator(leaveSelectors.sidebarLeave, { hasText: "Leave" })
      .first()
      .click();
    await this.page.waitForSelector("nav.oxd-topbar-body-nav");
    await this.page.locator(leaveSelectors.tabLeaveList).click();
    await this.page.waitForSelector(leaveSelectors.headerLeaveList);
  }

async searchEmployeeLeave(leave: LeaveRequest) {
  console.log(`Searching leave for ${leave.employeeName}...`);

  const empInput = this.page.locator(leaveSelectors.employeeNameInput);
  await empInput.waitFor({ state: "visible", timeout: 10000 });
  await empInput.click();
  await empInput.fill(leave.employeeName);

  console.log("⏳ Waiting for employee name suggestions...");
  const suggestionList = this.page.locator('div[role="option"]');
  await suggestionList.first().waitFor({ state: "visible", timeout: 10000 }).catch(() => {
    console.warn("⚠️ Suggestion list not visible, retrying...");
  });
  await this.page.waitForTimeout(1500);

  if (await suggestionList.first().isVisible()) {
    await suggestionList.first().click({ force: true });
    console.log("✅ Employee name selected from suggestion list.");
  } else {
    throw new Error(`❌ Could not find suggestion for ${leave.employeeName}`);
  }

  await this.page.click(leaveSelectors.leaveTypeDropdown);
  await this.page.locator(`div[role="option"]:has-text("${leave.leaveType}")`).click();
  await this.page.locator(leaveSelectors.searchButton).click();

  console.log("⏸ Waiting for table results to load...");
  await this.page.waitForSelector(leaveSelectors.tableBody, { timeout: 15000 });
  await this.page.waitForTimeout(3000);
  console.log("✅ Table loaded, ready to approve.");
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

    console.log("⏳ Waiting for Success toast...");
    const toast = this.page.locator(pimSelectors.common.toast);
    await toast.waitFor({ state: "visible", timeout: 20000 });
    await expect(toast).toContainText("Success");
    console.log("✅ Approval toast confirmed.");

    await toast.waitFor({ state: "detached", timeout: 15000 }).catch(() => {});
    console.log("✅ Toast disappeared, ready to verify.");
  }

async verifyApprovedStatus(employeeName: string) {
  console.log(`Verifying Approved status for ${employeeName}...`);

  const toast = this.page.locator('.oxd-toast');
  await toast.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await toast.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
  console.log("✅ Toast disappeared, waiting for table refresh...");

  const table = this.page.locator(leaveSelectors.tableBody);
  await table.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  console.log("🌀 Table hidden — refreshing data...");

  await table.waitFor({ state: 'visible', timeout: 20000 });
  await this.page.waitForTimeout(1500);

  const searchBtn = this.page.locator(leaveSelectors.searchButton);
  if (await searchBtn.isVisible()) {
    await searchBtn.click();
  }

  const approvedRow = this.page.locator(
    `//div[contains(@class,"oxd-table-row")]//div[contains(text(),"${employeeName}")]/ancestor::div[contains(@class,"oxd-table-row")]//div[contains(translate(text(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),"APPROVED")]`
  );

  await expect(approvedRow.first()).toBeVisible({ timeout: 20000 });
  console.log(`✅ Status verified as Approved.`);
}

}
