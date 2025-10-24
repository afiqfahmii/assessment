export interface LeaveRequest {
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  duration: string;
  comment?: string;
  status?: string;
}
