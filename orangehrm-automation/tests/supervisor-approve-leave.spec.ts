import { test } from '@playwright/test';
import { Employee } from '../src/models/Employee';
import { LoginPage } from '../src/pages/LoginPage';
import { LeaveListPage } from '../src/pages/LeaveListPage';

test('Supervisor can approve employee leave request', async ({ page }) => {
  test.setTimeout(120000);

  const employee: Employee = {
    firstName: 'Antony',
    middleName: 'Chadwick',
    lastName: 'Jones',
    employeeId: 'E2025',
    username: 'super_12983_659_1761243627031',
    password: 'Test@1234',
  };

  const supervisorUsername = 'super_12983_659_1761243627031'; 
  const supervisorPassword = 'Test@1234';

  const login = new LoginPage(page);
  const leaveList = new LeaveListPage(page);

  // Step 1: Login as Supervisor
  await login.goto();
  await login.login(supervisorUsername, supervisorPassword);

  // Step 2: Navigate to Leave → Leave List
  await leaveList.gotoLeaveListPage();

  // Step 3: Search for the employee’s leave
  const employeeFullName = `${employee.firstName} ${employee.middleName} ${employee.lastName}`;
  await leaveList.searchEmployeeLeave(employeeFullName);

  // Step 4: Approve the leave
  await leaveList.approveLeave(employeeFullName);

  console.log(`✅ Leave for ${employeeFullName} approved successfully.`);
});
