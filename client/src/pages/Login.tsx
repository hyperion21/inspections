import { useState, type SyntheticEvent } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

interface LoginRequest {
  employeeId: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const Login = () => {
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

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
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "400px" }}>
        <Card.Body>
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

export default Login;
