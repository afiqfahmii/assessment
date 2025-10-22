export const pimSelectors = {
  sidebar: {
    pimButton: 'span:has-text("PIM")',
    adminButton: 'span:has-text("Admin")',
  },
  navbar: {
    addEmployeeTab: 'a:has-text("Add Employee")',
    employeeListTab: 'a:has-text("Employee List")',
  },
  employeeForm: {
    firstName: 'input[name="firstName"]',
    middleName: 'input[name="middleName"]',
    lastName: 'input[name="lastName"]',
    employeeId: '//label[text()="Employee Id"]/following::input[1]',
    createLoginToggle: '.oxd-switch-input',
    username: '//label[text()="Username"]/following::input[1]',
    password: '//label[text()="Password"]/following::input[1]',
    confirmPassword: '//label[text()="Confirm Password"]/following::input[1]',
    saveButton: 'button:has-text("Save")',
  },
  common: {
    toast: '.oxd-toast',
    loader: '.oxd-form-loader',
  },
};
