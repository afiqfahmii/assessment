export const roles = {
  admin: {
    username: "Admin",
    password: "admin123",
  },

  supervisor: {
    employee: {
      firstName: "Supervisor",
      middleName: "Of",
      lastName: "Staff",
      employeeId: "1001",
      username: "super_12345_678",
      password: "Test@1234",
    },
    systemUser: {
      username: "sys_super_12345_678",
      password: "Test@1234",
      role: "Admin",
    },
  },

  employee: {
    employee: {
      firstName: "Antony",
      middleName: "Chadwick",
      lastName: "Jones",
      employeeId: "2025",
      username: "emp_49999",
      password: "Test@1234",
    },
    systemUser: {
      username: "sys_emp_14683",
      password: "Test@1234",
      role: "ESS",
    },
    leaveRequest: {
      employeeName: "Antony Chadwick Jones",
      leaveType: "CAN - Vacation",
      fromDate: "2025-10-31",
      toDate: "2025-10-31",
      duration: "Full Day",
      comment: "Requesting annual leave for vacation.",
      status: "Pending Approval",
    },
  },
};
