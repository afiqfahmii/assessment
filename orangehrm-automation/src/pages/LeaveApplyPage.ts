import { Page, expect } from "@playwright/test";
import { Employee } from "../models/Employee";

export class LeaveApplyPage {
  constructor(private page: Page) {}

  // ✅ Step 1: Navigate to Leave → Apply
  async gotoApplyLeavePage() {
    console.log("Navigating to Leave → Apply...");

    // Click Leave menu (use sidebar-specific selector to avoid duplicate breadcrumb element)
    await this.page.waitForTimeout(1000);
    const leaveSidebar = this.page.locator('.oxd-main-menu-item--name', { hasText: 'Leave' });
    await leaveSidebar.first().waitFor({ state: "visible", timeout: 20000 });
    await leaveSidebar.first().click({ force: true });

    await this.page.waitForSelector("nav.oxd-topbar-body-nav", {
      timeout: 20000,
    });

    const applyTab = this.page.locator('a:has-text("Apply")');
    await applyTab.waitFor({ state: "visible", timeout: 10000 });
    await applyTab.click({ force: true });

    await this.page.waitForSelector('h6:has-text("Apply Leave")', {
      timeout: 20000,
    });
    console.log("✅ Apply Leave page loaded.");
  }

  // ✅ Step 2: Fill and submit leave form
  async applyLeave(employee: Employee) {
    console.log(`Applying leave for ${employee.username}...`);

    // Select Leave Type
    await this.page
      .locator('//label[text()="Leave Type"]/../following-sibling::div//i')
      .click();
    const leaveOption = this.page.locator(
      'div[role="option"]:has-text("CAN - Vacation")'
    );
    await leaveOption.waitFor({ state: "visible", timeout: 10000 });
    await leaveOption.click();

    // ✅ Handle Date (placeholder = yyyy-dd-mm)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const yyyy = nextWeek.getFullYear();
    const dd = String(nextWeek.getDate()).padStart(2, "0");
    const mm = String(nextWeek.getMonth() + 1).padStart(2, "0");
    const dateStr = `${yyyy}-${dd}-${mm}`; // yyyy-dd-mm

    const fromDate = this.page.locator(
      '(//input[@placeholder="yyyy-dd-mm"])[1]'
    );
    const toDate = this.page.locator('(//input[@placeholder="yyyy-dd-mm"])[2]');

    await fromDate.waitFor({ state: "visible", timeout: 10000 });
    await toDate.waitFor({ state: "visible", timeout: 10000 });

    // Remove readonly attributes
    await this.page.evaluate(() => {
      document
        .querySelectorAll('input[placeholder="yyyy-dd-mm"]')
        .forEach((el) => el.removeAttribute("readonly"));
    });

    // Fill dates
    await fromDate.click({ force: true });
    await fromDate.fill(dateStr);

    // ✅ Close the calendar (press Tab or Escape)
    await this.page.keyboard.press("Tab");
    await this.page.waitForTimeout(500);

    await toDate.click({ force: true });
    await toDate.fill(dateStr);

    // ✅ Close the calendar after To Date
    await this.page.keyboard.press("Escape");
    await this.page.waitForTimeout(1000);
    console.log("✅ Dates filled and calendar dismissed.");

    // Select Duration (Full Day)
    console.log("Selecting duration...");
    const durationDropdown = this.page.locator(
      '//label[text()="Duration"]/../following-sibling::div'
    );
    await durationDropdown.waitFor({ state: "visible", timeout: 10000 });
    await durationDropdown.click();

    // Wait for options to appear
    const fullDayOption = this.page.locator(
      'div[role="option"]:has-text("Full Day")'
    );
    await fullDayOption.waitFor({ state: "visible", timeout: 10000 });
    await fullDayOption.click({ force: true });

    // ✅ Wait for the dropdown to close or form to stabilize
    await this.page.waitForTimeout(1500);
    await this.page.waitForSelector("div.oxd-select-text-input", {
      state: "visible",
      timeout: 10000,
    });
    console.log("✅ Duration selected successfully.");

    // ✅ Enter comment safely after dropdown settles
    console.log("Filling comment field...");
    const comment = this.page.locator("textarea.oxd-textarea");
    await comment.waitFor({ state: "visible", timeout: 20000 });
    await comment.fill("Requesting annual leave for vacation.");
    console.log("✅ Comment entered successfully.");

    // Click Apply
    const applyBtn = this.page.locator('button:has-text("Apply")');
    await applyBtn.waitFor({ state: "visible", timeout: 10000 });
    await applyBtn.click();

    // Wait for success toast
    await this.page.waitForSelector(".oxd-toast", { timeout: 20000 });
    await expect(this.page.locator(".oxd-toast")).toContainText("Success");
    console.log("✅ Leave successfully applied!");
  }

  // ✅ Step 3: Verify leave appears in My Leave tab
async verifyLeaveInMyLeaveTab(employee: Employee, appliedDate: string) {
  console.log("Navigating to Leave → My Leave...");

  // 🧩 Wait for toast (if any) to disappear before interacting
  await this.page.waitForTimeout(2000);
  await this.page.locator('.oxd-toast').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

  // ✅ Use sidebar-specific selector to avoid breadcrumb conflict
  const leaveSidebar = this.page.locator('.oxd-main-menu-item--name', { hasText: 'Leave' });
  await leaveSidebar.first().waitFor({ state: "visible", timeout: 20000 });
  await leaveSidebar.first().click({ force: true });

  // Wait for navbar to appear
  await this.page.waitForSelector("nav.oxd-topbar-body-nav", { timeout: 20000 });

  // ✅ Ensure My Leave tab is visible and click it
  const myLeaveTab = this.page.locator('a:has-text("My Leave")');
  await myLeaveTab.waitFor({ state: "visible", timeout: 10000 });
  await myLeaveTab.click({ force: true });

  // --- Continue as before ---
  await this.page.waitForSelector('h5:has-text("My Leave List")', { timeout: 20000 });
  console.log("✅ My Leave List page loaded.");

  // --- Fill Date Fields ---
  console.log("Filling From Date and To Date fields...");
  const fromDate = this.page.locator('(//input[@placeholder="yyyy-dd-mm"])[1]');
  const toDate = this.page.locator('(//input[@placeholder="yyyy-dd-mm"])[2]');

  // Remove readonly
  await this.page.evaluate(() => {
    document
      .querySelectorAll('input[placeholder="yyyy-dd-mm"]')
      .forEach((el) => el.removeAttribute("readonly"));
  });

  await fromDate.fill(appliedDate);
  await toDate.fill(appliedDate);

  // --- Select Pending Approval status ---
  console.log("Selecting 'Pending Approval' status...");
  await this.page.click('//label[text()="Show Leave with Status"]/../following-sibling::div//i');
  const pendingOption = this.page.locator('div[role="option"]:has-text("Pending Approval")');
  await pendingOption.waitFor({ state: "visible", timeout: 5000 });
  await pendingOption.click();

  // --- Select Leave Type ---
  console.log("Selecting Leave Type 'CAN - Vacation'...");
  await this.page.click('//label[text()="Leave Type"]/../following-sibling::div//i');
  const leaveTypeOption = this.page.locator('div[role="option"]:has-text("CAN - Vacation")');
  await leaveTypeOption.waitFor({ state: "visible", timeout: 5000 });
  await leaveTypeOption.click();

  // --- Click Search ---
  const searchBtn = this.page.locator('button:has-text("Search")');
  await searchBtn.waitFor({ state: "visible", timeout: 10000 });
  await searchBtn.click();

  // --- Verify Table Results ---
  console.log("Verifying leave appears in table...");

  // Wait briefly for the table to refresh
  await this.page.waitForTimeout(2000);

  // More specific locator: a row containing both date and leave type
  const tableRow = this.page.locator(
    `//div[contains(@class,"oxd-table-row") and .//div[contains(., "${appliedDate}")] and .//div[contains(., "CAN - Vacation")]]`
  );

  // Make sure at least one matching row is visible
  await expect(tableRow.first()).toBeVisible({ timeout: 15000 });

  // Then verify it also shows "Pending Approval"
  await expect(tableRow.first()).toContainText("Pending Approval");

  console.log("✅ Leave request correctly listed as Pending Approval!");

}

}
