import type { User } from "./user";

export interface JwtPayload {
  employeeId: string;
  role: string;
  firstName: string;
  lastName: string;
  exp: number;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  initialized: boolean;
}
