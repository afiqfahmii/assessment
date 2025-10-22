    export const pimSelectors = {
    // --- Employee Full Name ---
    firstNameInput: 'input[name="firstName"]',
    middleNameInput: 'input[name="middleName"]',
    lastNameInput: 'input[name="lastName"]',

    // --- Employee ID ---
    employeeIdInput: 'xpath=//label[text()="Employee Id"]/following::input[1]',

    // --- Create Login Details Toggle ---
    createLoginToggle: '.oxd-switch-input', // only one toggle on page

    // --- Login Details ---
    usernameInput: 'xpath=//label[text()="Username"]/following::input[1]',
    passwordInput: 'xpath=//label[text()="Password"]/following::input[1]',
    confirmPasswordInput: 'xpath=//label[text()="Confirm Password"]/following::input[1]',
    statusEnabledRadio: 'label:has-text("Enabled")',
    statusDisabledRadio: 'label:has-text("Disabled")',

    // --- Buttons ---
    saveButton: 'button:has-text("Save")',
    cancelButton: 'button:has-text("Cancel")',
    };
