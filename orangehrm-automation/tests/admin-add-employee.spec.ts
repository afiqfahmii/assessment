import { expect, test } from '@playwright/test';
import { Employee } from '../src/models/Employee';
import { SystemUser } from '../src/models/SystemUser';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';
import { UserManagementPage } from '../src/pages/UserManagementPage';

test('Admin can add new employee and create ESS user', async ({ page }) => {
  test.setTimeout(90000);
  
  const login = new LoginPage(page);
  const pim = new PIMPage(page);
  const userMgmt = new UserManagementPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');

  await pim.gotoAddEmployeePage();

  // Generate short unique IDs
  const timestamp = Date.now().toString().slice(-5);
  const rand = Math.floor(Math.random() * 1000);

  // 1️⃣ Create new employee record
  const employee: Employee = {
    firstName: 'Antony',
    middleName: 'Chadwick',
    lastName: 'Jones',
    employeeId: `${Math.floor(1000 + Math.random() * 9000)}`,
    username: `emp_${timestamp}_${rand}`,
    password: 'Test@1234',
  };

  const { result, username: employeeUsername } = await pim.addEmployee(employee);
  expect(result === 'redirect' || result === 'toast').toBeTruthy();

  // 2️⃣ Create matching System User (ESS)
  const systemUser: SystemUser = {
    employeeName: `${employee.firstName} ${employee.middleName} ${employee.lastName}`,
    role: 'ESS',
    username: `sysuser_${timestamp}_${rand}`,
    password: employee.password,
  };  

  await userMgmt.gotoUsersTab();
  await userMgmt.addSystemUser(
    systemUser.employeeName,
    systemUser.role,
    systemUser.username,
    systemUser.password
  );

  console.log(`✅ Employee Username: ${employeeUsername}`);
  console.log(`✅ System Username: ${systemUser.username}`);
});
