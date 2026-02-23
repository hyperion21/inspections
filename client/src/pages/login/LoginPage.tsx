import { useState, type SyntheticEvent } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import "./styles.css";

interface LoginRequest {
  employeeId: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const LoginPage = () => {
  const { login, isAuthenticated, initialized } = useAuth();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  if (initialized && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: LoginRequest = { employeeId, password };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert("Invalid employee ID or password");
      return;
    }

    const data: LoginResponse = await response.json();
    login(data.token);
  };

  return (
    <Container className="login-container d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 login-card d-flex flex-column justify-content-center">
        <Card.Body className="login-body">
          <h3 className="text-center mb-4">Employee Login</h3>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Employee Id</Form.Label>
              <Form.Control
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
