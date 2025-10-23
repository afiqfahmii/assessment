export interface SystemUser {
  employeeName: string; 
  role: 'Admin' | 'ESS';
  status?: 'Enabled' | 'Disabled';
  username: string;
  password: string;
}
