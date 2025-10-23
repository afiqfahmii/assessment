import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { PIMPage } from '../src/pages/PIMPage';

test('Admin can assign supervisor to employee', async ({ page }) => {
  test.setTimeout(90000);
  const login = new LoginPage(page);
  const pim = new PIMPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await pim.gotoEmployeeList();
  await pim.assignSupervisor('Antony Chadwick Jones', 'my test sv');
});
