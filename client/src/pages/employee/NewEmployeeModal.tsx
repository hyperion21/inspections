import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";

interface NewEmployeeModalProps {
  show: boolean;
  onHide: () => void;
  token: string;
  onCreated: () => void;
}

const NewEmployeeModal = ({
  show,
  onHide,
  token,
  onCreated,
}: NewEmployeeModalProps) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("INSPECTOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setEmployeeId("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setRole("INSPECTOR");
      setError("");
    }
  }, [show]);

  const handleCreate = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await baseFetch(
        "/users",
        {
          method: "POST",
          body: JSON.stringify({
            employeeId,
            password,
            firstName,
            lastName,
            role,
          }),
        },
        token,
      );

      onCreated();
      onHide();
    } catch (err: any) {
      setError(err.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Employee</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}

        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="INSPECTOR">INSPECTOR</option>
              <option value="MANAGER">MANAGER</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEmployeeModal;
