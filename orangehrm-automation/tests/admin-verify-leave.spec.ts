import { test } from "@playwright/test";
import { roles } from "../src/fixtures/roles";
import { LoginPage } from "../src/pages/LoginPage";
import { LeaveListPage } from "../src/pages/LeaveListPage";

test("Admin can verify Approved leave request in Leave List", async ({ page }) => {
  test.setTimeout(90000);
  const login = new LoginPage(page);
  const leaveList = new LeaveListPage(page);

  // Step 1: Login as Admin
  await login.goto();
  await login.login(roles.admin.username, roles.admin.password);
  console.log("✅ Logged in as Admin.");

  // Step 2: Navigate to Leave → Leave List
  await leaveList.gotoLeaveListPage();

  // Step 3: Search employee leave using fixture
  const leave = roles.employee.leaveRequest;
  await leaveList.searchEmployeeLeave(leave);

  // Step 4: Verify Approved status
  await leaveList.verifyApprovedStatus(leave.employeeName);
  console.log(`✅ Leave for ${leave.employeeName} verified as ${leave.status}.`);
});
