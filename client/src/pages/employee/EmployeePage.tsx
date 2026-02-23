import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { baseFetch } from "../../api/baseFetch";

import TopNavbar from "../../components/topNavbar/TopNavbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { Employee } from "../../types/user";
import NewEmployeeModal from "./NewEmployeeModal";

const EmployeePage = () => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    if (!token) return;
    const data = await baseFetch("/users", {}, token);
    setEmployees(data);
  };

  useEffect(() => {
    void fetchEmployees();
  }, [token]);

  const handleCreatedOrUpdated = () => {
    showToast(
      editingEmployee
        ? "Employee updated successfully!"
        : "Employee created successfully!",
      "success",
    );
    void fetchEmployees();
    setEditingEmployee(null);
    setShowModal(false);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteClick = async (employee: Employee) => {
    if (!token) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
    );
    if (!confirmed) return;

    try {
      await baseFetch(
        `/users/${employee.employeeId}`,
        { method: "DELETE" },
        token,
      );
      showToast("Employee deleted successfully!", "success");
      void fetchEmployees();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to delete employee", "danger");
    }
  };

  return (
    <>
      <TopNavbar />
      <Container className="p-4">
        <h3>Employees</h3>
        <hr />

        <Row className="mb-3">
          <Col className="text-end">
            <Button
              onClick={() => setShowModal(true)}
              style={{ width: "140px" }}
            >
              New
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Is Active</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.role}</td>
                <td>{emp.isActive ? "Yes" : "No"}</td>
                <td>{new Date(emp.createdDate).toLocaleDateString()}</td>
                <td>
                  {emp.isActive && !(user?.employeeId === emp.employeeId) && (
                    <>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEditClick(emp)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => handleDeleteClick(emp)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <NewEmployeeModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          token={token!}
          onCreated={handleCreatedOrUpdated}
          editingEmployee={editingEmployee ?? undefined}
        />
      </Container>
    </>
  );
};

export default EmployeePage;
