▶️ Run Tests

Run all tests
npx playwright test

Run a specific test
npx playwright test tests/employee.apply-leave.spec.ts

Run in headed mode (see browser)
npx playwright test --headed

Run with specific browser
npx playwright test --project=firefox

After any test run, open the report:
npx playwright show-report
