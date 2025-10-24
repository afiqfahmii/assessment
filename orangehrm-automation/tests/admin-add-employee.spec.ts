import { expect, test } from '@playwright/test';
import { roles } from '../src/fixtures/roles';
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

  // Step 1️⃣: Login as Admin
  await login.goto();
  await login.login(roles.admin.username, roles.admin.password);

  // Step 2️⃣: Navigate to Add Employee
  await pim.gotoAddEmployeePage();

  // Step 3️⃣: Use static employee details from roles fixture
  const employee: Employee = {
    firstName: roles.employee.employee.firstName,
    middleName: roles.employee.employee.middleName,
    lastName: roles.employee.employee.lastName,
    username: roles.employee.employee.username,
    employeeId: roles.employee.employee.employeeId,
    password: roles.employee.employee.password,
  };

  // Step 4️⃣: Create employee record
  const { result, username: employeeUsername } = await pim.addEmployee(employee);
  expect(result === 'redirect' || result === 'toast').toBeTruthy();

  // Step 5️⃣: Create matching System User (ESS)
  const systemUser: SystemUser = {
    employeeName: `${employee.firstName} ${employee.middleName} ${employee.lastName}`,
    role: 'ESS',
    username: employee.username,
    password: employee.password,
  };

  await userMgmt.gotoUsersTab();
  await userMgmt.addSystemUser(
    systemUser.employeeName,
    systemUser.role,
    systemUser.username,
    systemUser.password
  );

  console.log(`✅ Employee created: ${employeeUsername}`);
  console.log(`✅ System User created: ${systemUser.username}`);
});
