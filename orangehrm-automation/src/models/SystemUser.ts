export interface SystemUser {
  employeeName: string; // full name of the employee to link
  role: 'Admin' | 'ESS'; // system role
  status?: 'Enabled' | 'Disabled'; // optional, can add later
  username: string;
  password: string;
}
    