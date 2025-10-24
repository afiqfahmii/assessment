import { test } from '@playwright/test';
import { roles } from '../src/fixtures/roles';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';

test('Admin can assign supervisor to employee', async ({ page }) => {
  test.setTimeout(90000);

  const login = new LoginPage(page);
  const pim = new PIMPage(page);

  // Step 1️⃣: Login as Admin
  await login.goto();
  await login.login(roles.admin.username, roles.admin.password);

  // Step 2️⃣: Go to Employee List
  await pim.gotoEmployeeList();

  // Step 3️⃣: Assign Supervisor to Employee using role data
  const employeeFullName = `${roles.employee.employee.firstName} ${roles.employee.employee.middleName} ${roles.employee.employee.lastName}`;
  const supervisorFullName = `Supervisor Of Staff`;

  await pim.assignSupervisor(employeeFullName, supervisorFullName);

  console.log(`✅ Assigned supervisor '${supervisorFullName}' to employee '${employeeFullName}' successfully.`);
});
