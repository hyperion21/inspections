export interface User {
  employeeId: string;
  role: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}

export type Inspector = Omit<User, "createdDate" | "lastUpdatedDate">;
