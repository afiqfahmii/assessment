import { Page, expect } from "@playwright/test";

export class LeaveListPage {
  constructor(private page: Page) {}

  // Step 1: Navigate to Leave → Leave List
  async gotoLeaveListPage() {
    console.log("Navigating to Leave → Leave List...");

    // Click sidebar Leave menu (use .oxd-main-menu-item--name to avoid breadcrumb conflict)
    const leaveSidebar = this.page.locator('.oxd-main-menu-item--name', { hasText: 'Leave' });
    await leaveSidebar.first().waitFor({ state: "visible", timeout: 20000 });
    await leaveSidebar.first().click({ force: true });

    // Wait for top nav bar to appear
    await this.page.waitForSelector("nav.oxd-topbar-body-nav", { timeout: 20000 });

    // Click Leave List tab
    const leaveListTab = this.page.locator('a:has-text("Leave List")');
    await leaveListTab.waitFor({ state: "visible", timeout: 10000 });
    await leaveListTab.click({ force: true });

    // Wait for Leave List header to appear
    await this.page.waitForSelector('h5:has-text("Leave List")', { timeout: 20000 });
    console.log("✅ Leave List page loaded.");
  }

  // Step 2: Search for an employee's leave request
  async searchEmployeeLeave(employeeName: string) {
    console.log(`Searching for leave requests for ${employeeName}...`);

    // Fill Employee Name using same reliable XPath pattern as other pages
    const empInput = this.page.locator('//label[text()="Employee Name"]/../following-sibling::div//input');
    await empInput.waitFor({ state: "visible", timeout: 10000 });
    await empInput.fill(employeeName);

    // Wait for suggestions to appear
    await this.page.waitForTimeout(2000);

    // Select the first suggestion (if multiple match)
    const suggestion = this.page.locator('div[role="option"]').first();
    await suggestion.waitFor({ state: "visible", timeout: 10000 });
    await suggestion.click({ force: true });

    // Select Leave Type dropdown
    console.log("Selecting Leave Type...");
    await this.page.click('//label[text()="Leave Type"]/../following-sibling::div//i');
    const leaveTypeOption = this.page.locator('div[role="option"]:has-text("CAN - Vacation")');
    await leaveTypeOption.waitFor({ state: "visible", timeout: 10000 });
    await leaveTypeOption.click({ force: true });

    // Click Search
    console.log("Clicking Search...");
    const searchBtn = this.page.locator('button:has-text("Search")');
    await searchBtn.waitFor({ state: "visible", timeout: 10000 });
    await searchBtn.click();

    // Wait for results table to appear
    await this.page.waitForSelector('div.oxd-table-body', { timeout: 20000 });
    console.log("✅ Search completed, results displayed.");
  }

  // ✅ Step 3: Approve employee's leave request
  async approveLeave(employeeName: string) {
    console.log(`Attempting to approve leave for ${employeeName}...`);

    // Wait for row with employee name to be visible
    const row = this.page.locator(
      `//div[contains(@class,"oxd-table-row")]//div[normalize-space(text())="${employeeName}"]/ancestor::div[contains(@class,"oxd-table-row")]`
    );
    await row.first().waitFor({ state: "visible", timeout: 20000 });

    // Wait a moment for buttons to render
    await this.page.waitForTimeout(1500);

    // Try to locate the Approve button in that same row
    const approveBtn = row.locator('.oxd-button:has-text("Approve")');

    // If not immediately visible, scroll into view
    await approveBtn.first().scrollIntoViewIfNeeded();
    await approveBtn.first().waitFor({ state: "visible", timeout: 10000 });

    // Force click if overlayed
    console.log("Clicking Approve button...");
    await approveBtn.first().click({ force: true });

    // Wait for success toast
    await this.page.waitForSelector(".oxd-toast", { timeout: 20000 });
    await expect(this.page.locator(".oxd-toast")).toContainText("Success");

    console.log(`✅ Leave for ${employeeName} successfully approved.`);
  }

  // Step 4 (Optional): Verify status updated to Approved in table
  async verifyApprovedStatus(employeeName: string) {
    console.log(`Verifying Approved status for ${employeeName}...`);
    const approvedRow = this.page.locator(
      `//div[contains(@class,"oxd-table-row")]//div[contains(text(),"${employeeName}")]/ancestor::div[contains(@class,"oxd-table-row")]//div[contains(text(),"Approved")]`
    );
    await expect(approvedRow.first()).toBeVisible({ timeout: 15000 });
    console.log("✅ Status verified as Approved.");
  }
}
