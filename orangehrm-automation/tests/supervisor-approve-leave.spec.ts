import { test } from "@playwright/test";
import { roles } from "../src/fixtures/roles";
import { LoginPage } from "../src/pages/LoginPage";
import { LeaveListPage } from "../src/pages/LeaveListPage";

test("Supervisor can approve employee's leave request", async ({ page }) => {
  test.setTimeout(120000);

  const login = new LoginPage(page);
  const leaveList = new LeaveListPage(page);

  // 🧩 Load supervisor credentials and employee leave details from roles
  const supervisor = roles.supervisor.systemUser;
  const leaveRequest = roles.employee.leaveRequest;

  // Step 1️⃣: Login as Supervisor
  await login.goto();
  await login.login(supervisor.username, supervisor.password);
  console.log(`✅ Logged in as Supervisor (${supervisor.username}).`);

  // Step 2️⃣: Navigate to Leave → Leave List
  await leaveList.gotoLeaveListPage();

  // Step 3️⃣: Search employee's leave
  await leaveList.searchEmployeeLeave(leaveRequest);

  // Step 4️⃣: Approve the leave request
  await leaveList.approveLeave(leaveRequest.employeeName);

  // Step 5️⃣: Verify the leave status changes to Approved
  await leaveList.verifyApprovedStatus(leaveRequest.employeeName);

  console.log(`✅ Leave for ${leaveRequest.employeeName} approved and verified successfully.`);
});
