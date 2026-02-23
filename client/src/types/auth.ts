export interface JwtPayload {
  employeeId: string;
  role: string;
  exp: number;
}

export interface AuthContextType {
  token: string | null;
  employeeId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
