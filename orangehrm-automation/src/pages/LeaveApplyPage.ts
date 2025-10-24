import { Page, expect } from "@playwright/test";
import { Employee } from "../models/Employee";
import { LeaveRequest } from "../models/LeaveRequest";
import { leaveSelectors } from "../selectors/leave.selectors";

export class LeaveApplyPage {
  constructor(private page: Page) {}

  // ✅ Step 1: Navigate to Leave → Apply
  async gotoApplyLeavePage() {
    console.log("Navigating to Leave → Apply...");

    // Click sidebar "Leave"
    await this.page
      .locator(leaveSelectors.sidebarLeave, { hasText: "Leave" })
      .first()
      .click({ force: true });

    // Wait for navbar to load and go to Apply tab
    await this.page.waitForSelector(leaveSelectors.navBar);
    await this.page.locator(leaveSelectors.tabApply).click();

    await this.page.waitForSelector(leaveSelectors.headerApplyLeave);
    console.log("✅ Apply Leave page loaded.");
  }

  // ✅ Step 2: Apply Leave
  async applyLeave(employee: Employee, leave: LeaveRequest) {
    console.log(`Applying leave for ${employee.username}...`);

    // Select Leave Type
    await this.page.locator(leaveSelectors.leaveTypeDropdown).click();
    const leaveOption = this.page.locator(
      `div[role="option"]:has-text("${leave.leaveType}")`
    );
    await leaveOption.waitFor({ state: "visible", timeout: 10000 });
    await leaveOption.click();

    // Fill Dates
    const fromDate = this.page.locator(leaveSelectors.dateInputFrom);
    const toDate = this.page.locator(leaveSelectors.dateInputTo);

    await this.page.evaluate(() => {
      document
        .querySelectorAll('input[placeholder="yyyy-dd-mm"]')
        .forEach((el) => el.removeAttribute("readonly"));
    });

    await fromDate.click({ force: true });
    await fromDate.press("Control+A");
    await fromDate.press("Backspace");
    await fromDate.fill(leave.fromDate);

    await toDate.click({ force: true });
    await toDate.press("Control+A");
    await toDate.press("Backspace");
    await toDate.fill(leave.toDate);

    await this.page.keyboard.press("Escape");
    console.log("✅ Dates filled successfully.");

    // Select Duration
    await this.page.locator(leaveSelectors.durationDropdown).click();
    await this.page.locator(leaveSelectors.fullDayOption).click();
    console.log("✅ Duration selected.");

    // Fill Comment
    if (leave.comment) {
      const comment = this.page.locator(leaveSelectors.commentTextArea);
      await comment.fill(leave.comment);
      console.log("✅ Comment added.");
    }

    // Click Apply
    await this.page.locator(leaveSelectors.applyButton).click();
    await expect(this.page.locator(leaveSelectors.toastMessage)).toContainText("Success");
    console.log("✅ Leave successfully applied!");
  }

  // ✅ Step 3: Verify in My Leave
  async verifyLeaveInMyLeaveTab(leave: LeaveRequest) {
    console.log("Navigating to Leave → My Leave...");

    await this.page
      .locator(leaveSelectors.sidebarLeave, { hasText: "Leave" })
      .first()
      .click({ force: true });

    await this.page.waitForSelector(leaveSelectors.navBar);
    await this.page.locator(leaveSelectors.tabMyLeave).click();
    await this.page.waitForSelector(leaveSelectors.headerMyLeaveList);
    console.log("✅ My Leave List page loaded.");

    // Fill Dates
    const fromDate = this.page.locator(leaveSelectors.dateInputFrom);
    const toDate = this.page.locator(leaveSelectors.dateInputTo);

    await this.page.evaluate(() => {
      document
        .querySelectorAll('input[placeholder="yyyy-dd-mm"]')
        .forEach((el) => el.removeAttribute("readonly"));
    });

    await fromDate.fill(leave.fromDate);
    await toDate.fill(leave.toDate);

    // Select Pending Approval
    await this.page.click(leaveSelectors.statusDropdown);
    await this.page.locator(leaveSelectors.pendingApprovalOption).click();

    // Select Leave Type
    await this.page.click(leaveSelectors.leaveTypeDropdown);
    await this.page
      .locator(`div[role="option"]:has-text("${leave.leaveType}")`)
      .click();

    // Click Search
    await this.page.locator(leaveSelectors.searchButton).click();

    // Verify in table
    const tableRow = this.page.locator(
      `//div[contains(@class,"oxd-table-row") and .//div[contains(., "${leave.fromDate}")] and .//div[contains(., "${leave.leaveType}")]]`
    );

    await expect(tableRow.first()).toBeVisible({ timeout: 15000 });
    await expect(tableRow.first()).toContainText(leave.status ?? "Pending Approval");
    console.log(`✅ Leave correctly listed as ${leave.status ?? "Pending Approval"}!`);
  }
}
