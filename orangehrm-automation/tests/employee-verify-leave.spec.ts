import { test } from "@playwright/test";
import { roles } from "../src/fixtures/roles";
import { LoginPage } from "../src/pages/LoginPage";
import { LeaveApplyPage } from "../src/pages/LeaveApplyPage";

test("Employee can verify leave status in My Leave tab", async ({ page }) => {
  test.setTimeout(60000);

  const login = new LoginPage(page);
  const leave = new LeaveApplyPage(page);

  // 🧩 Load from roles fixture
  const employee = roles.employee.employee; // PIM data
  const systemUser = roles.employee.systemUser; // Login credentials
  const leaveRequest = roles.employee.leaveRequest; // Leave request details

  // 🧭 Step 1: Login as employee system user
  await login.goto();
  await login.login(systemUser.username, systemUser.password);
  console.log(`✅ Logged in as ${systemUser.username}`);

  // 🧭 Step 2: Verify applied leave in My Leave tab
  await leave.verifyLeaveInMyLeaveTab(leaveRequest);

  console.log(
    `✅ Verified ${leaveRequest.leaveType} for ${leaveRequest.employeeName} as ${leaveRequest.status}`
  );
});
