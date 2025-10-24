import { expect, test } from '@playwright/test';
import { roles } from '../src/fixtures/roles';
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
  await login.login(roles.admin.username, roles.admin.password);

  // Step 2️⃣: Go to Add Employee page
  await pim.gotoAddEmployeePage();

  // Step 3️⃣: Use supervisor data from roles fixture
  const supervisor: Employee = {
    firstName: 'Supervisor',
    middleName: 'Of',
    lastName: 'Staff',
    employeeId: 'E9999', // you can keep this static or randomize slightly
    username: roles.supervisor.username,
    password: roles.supervisor.password,
  };

  // Step 4️⃣: Create supervisor employee record
  const { result, username: supervisorUsername } = await pim.addEmployee(supervisor);
  expect(result === 'redirect' || result === 'toast').toBeTruthy();

  // Step 5️⃣: Create matching system user (Admin role)
  const systemUser: SystemUser = {
    employeeName: `${supervisor.firstName} ${supervisor.middleName} ${supervisor.lastName}`,
    role: 'Admin',
    username: roles.supervisor.username, // ✅ same username as employee
    password: roles.supervisor.password,
  };

  await userMgmt.gotoUsersTab();
  await userMgmt.addSystemUser(
    systemUser.employeeName,
    systemUser.role,
    systemUser.username,
    systemUser.password
  );

  console.log(`✅ Supervisor employee created: ${supervisorUsername}`);
  console.log(`✅ Supervisor system user created: ${systemUser.username}`);
});
