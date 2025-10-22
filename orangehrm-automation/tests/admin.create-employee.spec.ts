import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test('Admin adds a new employee', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Login as Admin
  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');
  await loginPage.verifyLogin();

  // Step 2: TODO -> Go to PIM -> Add Employee (you’ll add this next)
});
