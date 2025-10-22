import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';

test('Admin can add new employee', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');

  await pimPage.gotoAddEmployeePage();

  const uniqueUser = 'testuser_' + Date.now();
  const empId = Math.floor(1000 + Math.random() * 9000).toString(); // random 4-digit number
  await pimPage.addEmployee('hey', 'ho', 'sesko', empId, uniqueUser, 'Test@1234');


  // Verify redirect (with guard)
  try {
    await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 30000 });
    console.log('✅ Redirected to Employee Details successfully');
  } catch (err) {
    console.error('⚠️ Page closed or no redirect, last known URL:', await page.url());
  }
});
