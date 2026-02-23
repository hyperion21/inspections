export interface User {
  employeeId: string;
  role: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  lastUpdatedDate: Date;
  isActive: boolean;
}

export type Inspector = Omit<User, "createdDate" | "lastUpdatedDate">;

export type Employee = Omit<User, "lastUpdatedDate">;
