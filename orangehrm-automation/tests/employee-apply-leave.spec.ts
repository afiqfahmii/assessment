import { test } from '@playwright/test';
import { Employee } from '../src/models/Employee';
import { LeaveApplyPage } from '../src/pages/LeaveApplyPage';
import { LoginPage } from '../src/pages/LoginPage';

test('Employee can apply for Annual Leave', async ({ page }) => {
  test.setTimeout(90000); // allow enough time for slow site

  // Example employee (from previous created user)
  const employee: Employee = {
    firstName: 'Hey',
    middleName: 'Ho',
    lastName: 'Sesko',
    employeeId: 'E2025',
    username: 'emp_29911_988_1761216642526', // use your actual generated username
    password: 'Test@1234',
  };

  const login = new LoginPage(page);
  const leave = new LeaveApplyPage(page);

  // Step 1: Login
  await login.goto();
  await login.login(employee.username, employee.password);

  // Step 2: Navigate to Leave → Apply
  await leave.gotoApplyLeavePage();

  // Step 3: Apply for Annual Leave
  await leave.applyLeave(employee);
});
