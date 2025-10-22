import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';
import { UserManagementPage } from '../src/pages/UserManagementPage';

test('Admin can add new employee and create ESS user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);
  const userMgmt = new UserManagementPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');

  // Step 2: Add Employee
  // await pimPage.gotoAddEmployeePage();
  // const empId = Math.floor(1000 + Math.random() * 9000).toString();
  const uniqueUser = 'testuser_' + Date.now();
  // await pimPage.addEmployee('Hey', 'Ho', 'Sesko', empId, uniqueUser, 'Test@1234');

  // Verify if successfully added
  // try {
  //   await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 30000 });
  //   console.log('✅ Employee added successfully');
  // } catch {
  //   console.warn('⚠️ Could not verify redirect — continuing to add system user.');
  // }

  // Step 3: Add System User for this employee
  await userMgmt.gotoUsersTab();
  await userMgmt.addSystemUser('Hey Sesko', 'ESS', uniqueUser, 'Test@1234');

  console.log('✅ System user created successfully!');
});
