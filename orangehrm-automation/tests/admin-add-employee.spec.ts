import { expect, test } from '@playwright/test';
import { Employee } from '../src/models/Employee';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';
import { UserManagementPage } from '../src/pages/UserManagementPage';

test('Admin can add new employee and create ESS user', async ({ page }) => {
  const login = new LoginPage(page);
  const pim = new PIMPage(page);
  const userMgmt = new UserManagementPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');

  await pim.gotoAddEmployeePage();

  const employee: Employee = {
    firstName: 'Hey',
    middleName: 'Ho',
    lastName: 'Sesko',
    employeeId: `${Math.floor(1000 + Math.random() * 9000)}`,
    username: `testuser_${Date.now()}`,
    password: 'Test@1234',
  };

  const { result, username } = await pim.addEmployee(employee);
  expect(result === 'redirect' || result === 'toast').toBeTruthy();

  await userMgmt.gotoUsersTab();
  await userMgmt.addSystemUser(`${employee.firstName} ${employee.middleName} ${employee.lastName}`, 'ESS', username, employee.password);
});
