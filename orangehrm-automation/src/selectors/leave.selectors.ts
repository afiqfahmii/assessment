export const leaveSelectors = {
  // 🧭 Sidebar & Tabs
  sidebarLeave: '.oxd-main-menu-item--name',
  navBar: 'nav.oxd-topbar-body-nav',
  tabApply: 'a:has-text("Apply")',
  tabMyLeave: 'a:has-text("My Leave")',
  tabLeaveList: 'a:has-text("Leave List")',

  // 📝 Common Form Fields
  employeeNameInput: '//label[text()="Employee Name"]/../following-sibling::div//input',
  leaveTypeDropdown: '//label[text()="Leave Type"]/../following-sibling::div//i',
  durationDropdown: '//label[text()="Duration"]/../following-sibling::div',
  fullDayOption: 'div[role="option"]:has-text("Full Day")',
  commentTextArea: 'textarea.oxd-textarea',
  statusDropdown: '//label[text()="Show Leave with Status"]/../following-sibling::div//i',
  pendingApprovalOption: 'div[role="option"]:has-text("Pending Approval")',
  leaveTypeOptionVacation: 'div[role="option"]:has-text("CAN - Vacation")',

  // 📅 Date Inputs
  dateInputFrom: '(//input[@placeholder="yyyy-dd-mm"])[1]',
  dateInputTo: '(//input[@placeholder="yyyy-dd-mm"])[2]',

  // 🔘 Buttons
  searchButton: 'button:has-text("Search")',
  applyButton: 'button:has-text("Apply")',
  approveButton: 'button:has-text("Approve")',

  // 📊 Table & Toast
  tableBody: 'div.oxd-table-body',
  toastMessage: '.oxd-toast',

  // 🏷️ Page Headers
  headerApplyLeave: 'h6:has-text("Apply Leave")',
  headerMyLeaveList: 'h5:has-text("My Leave List")',
  headerLeaveList: 'h5:has-text("Leave List")',
};
