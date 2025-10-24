import { Page, expect } from "@playwright/test";
import { Employee } from "../models/Employee";
import { LeaveRequest } from "../models/LeaveRequest";
import { leaveSelectors } from "../selectors/leave.selectors";

export class LeaveApplyPage {
  constructor(private page: Page) {}

  async gotoApplyLeavePage() {
    console.log("Navigating to Leave → Apply...");

    await this.page
      .locator(leaveSelectors.sidebarLeave, { hasText: "Leave" })
      .first()
      .click({ force: true });

    await this.page.waitForSelector(leaveSelectors.navBar);
    await this.page.locator(leaveSelectors.tabApply).click();

    await this.page.waitForSelector(leaveSelectors.headerApplyLeave);
    console.log("✅ Apply Leave page loaded.");
  }

  async applyLeave(employee: Employee, leave: LeaveRequest) {
    console.log(`Applying leave for ${employee.username}...`);

    await this.page.locator(leaveSelectors.leaveTypeDropdown).click();
    const leaveOption = this.page.locator(
      `div[role="option"]:has-text("${leave.leaveType}")`
    );
    await leaveOption.waitFor({ state: "visible", timeout: 10000 });
    await leaveOption.click();

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

    await this.page.locator(leaveSelectors.durationDropdown).click();
    await this.page.locator(leaveSelectors.fullDayOption).click();
    console.log("✅ Duration selected.");

    if (leave.comment) {
      const comment = this.page.locator(leaveSelectors.commentTextArea);
      await comment.fill(leave.comment);
      console.log("✅ Comment added.");
    }

    await this.page.locator(leaveSelectors.applyButton).click();
    await expect(this.page.locator(leaveSelectors.toastMessage)).toContainText("Success");
    console.log("✅ Leave successfully applied!");
  }

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

    const fromDate = this.page.locator(leaveSelectors.dateInputFrom);
    const toDate = this.page.locator(leaveSelectors.dateInputTo);

    await this.page.evaluate(() => {
      document
        .querySelectorAll('input[placeholder="yyyy-dd-mm"]')
        .forEach((el) => el.removeAttribute("readonly"));
    });

    await fromDate.fill(leave.fromDate);
    await toDate.fill(leave.toDate);

    await this.page.click(leaveSelectors.statusDropdown);
    await this.page.locator(leaveSelectors.pendingApprovalOption).click();
    await this.page.click(leaveSelectors.leaveTypeDropdown);
    await this.page
      .locator(`div[role="option"]:has-text("${leave.leaveType}")`)
      .click();
    await this.page.locator(leaveSelectors.searchButton).click();

    const tableRow = this.page.locator(
      `//div[contains(@class,"oxd-table-row") and .//div[contains(., "${leave.fromDate}")] and .//div[contains(., "${leave.leaveType}")]]`
    );

    await expect(tableRow.first()).toBeVisible({ timeout: 15000 });
    await expect(tableRow.first()).toContainText(leave.status ?? "Pending Approval");
    console.log(`✅ Leave correctly listed as ${leave.status ?? "Pending Approval"}!`);
  }
}
