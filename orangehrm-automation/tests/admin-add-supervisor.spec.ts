import { expect, test } from '@playwright/test';
import { Employee } from '../src/models/Employee';
import { SystemUser } from '../src/models/SystemUser';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';
import { UserManagementPage } from '../src/pages/UserManagementPage';

test('Admin can add new Supervisor and create System User', async ({ page }) => {
  test.setTimeout(90000);
  
  const login = new LoginPage(page);
  const pim = new PIMPage(page);
  const userMgmt = new UserManagementPage(page);

  // Step 1️⃣: Login as Admin
  await login.goto();
  await login.login('Admin', 'admin123');

  // Step 2️⃣: Navigate to Add Employee and create new Supervisor record
  await pim.gotoAddEmployeePage();

  // Generate unique identifiers
  const timestamp = Date.now().toString().slice(-5);
  const rand = Math.floor(Math.random() * 1000);

  const supervisor: Employee = {
    firstName: 'Supervisor',
    middleName: 'Of',
    lastName: 'Staff',
    employeeId: `${Math.floor(1000 + Math.random() * 9000)}`,
    username: `super_${timestamp}_${rand}`,
    password: 'Test@1234',
  };

  const { result, username: supervisorUsername } = await pim.addEmployee(supervisor);
  expect(result === 'redirect' || result === 'toast').toBeTruthy();

  // Step 3️⃣: Create a System User for this supervisor
  const systemUser: SystemUser = {
    employeeName: `${supervisor.firstName} ${supervisor.middleName} ${supervisor.lastName}`,
    role: 'Admin', // 👈 supervisor access — change to 'ESS' if your system defines supervisors differently
    username: `sys_super_${timestamp}_${rand}`,
    password: supervisor.password,
  };

  await userMgmt.gotoUsersTab();
  await userMgmt.addSystemUser(
    systemUser.employeeName,
    systemUser.role,
    systemUser.username,
    systemUser.password
  );

  console.log(`✅ Supervisor employee created: ${supervisorUsername}`);
  console.log(`✅ Supervisor system user: ${systemUser.username}`);
});
