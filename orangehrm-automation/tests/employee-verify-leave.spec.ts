import { test } from '@playwright/test';
import { Employee } from '../src/models/Employee';
import { LeaveApplyPage } from '../src/pages/LeaveApplyPage';
import { LoginPage } from '../src/pages/LoginPage';

test('Employee can verify leave status in My Leave tab', async ({ page }) => {
  test.setTimeout(60000);

  // 🔹 Use existing employee credentials (already applied leave before)
  const employee: Employee = {
    firstName: 'Antony',
    middleName: 'Chadwick',
    lastName: 'Jones',
    employeeId: 'E2025',
    username: 'emp_14683_338_1761243528283',
    password: 'Test@1234',
  };

  const login = new LoginPage(page);
  const leave = new LeaveApplyPage(page);

  // Step 1️⃣: Login as employee
  await login.goto();
  await login.login(employee.username, employee.password);

  // Step 2️⃣: Navigate to Leave → My Leave
  console.log('Navigating to My Leave tab for verification...');

  // Step 3️⃣: Use the same applied date as in the original apply test
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const yyyy = nextWeek.getFullYear();
  const dd = String(nextWeek.getDate()).padStart(2, '0');
  const mm = String(nextWeek.getMonth() + 1).padStart(2, '0');
  const appliedDate = `${yyyy}-${dd}-${mm}`; // yyyy-dd-mm

  // Step 4️⃣: Verify that the leave appears in "My Leave" tab
  await leave.verifyLeaveInMyLeaveTab(employee, appliedDate);

  console.log('✅ Leave verification completed successfully!');
});
