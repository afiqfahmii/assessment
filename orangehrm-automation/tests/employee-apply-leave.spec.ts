import { test } from "@playwright/test";
import { roles } from "../src/fixtures/roles";
import { LoginPage } from "../src/pages/LoginPage";
import { LeaveApplyPage } from "../src/pages/LeaveApplyPage";

test("Employee can apply for Annual Leave", async ({ page }) => {
  test.setTimeout(90000);

  const login = new LoginPage(page);
  const leave = new LeaveApplyPage(page);

  // 🧩 Load data from roles fixture
  const employee = roles.employee.employee;
  const systemUser = roles.employee.systemUser;
  const leaveRequest = roles.employee.leaveRequest;

  // 🧭 Step 1: Login as the employee’s system user
  await login.goto();
  await login.login(systemUser.username, systemUser.password);
  console.log(`✅ Logged in as ${systemUser.username}`);

  // 🧭 Step 2: Navigate to Leave → Apply
  await leave.gotoApplyLeavePage();

  // 🧩 Step 3: Apply leave using the fixture data
  await leave.applyLeave(employee, leaveRequest);

  console.log(`✅ Leave applied for ${leaveRequest.employeeName} (${leaveRequest.fromDate})`);
});
