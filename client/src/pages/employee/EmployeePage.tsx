import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";

import TopNavbar from "../../components/topNavbar/TopNavbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import NewEmployeeModal from "./NewEmployeeModal";

interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  createdDate: string;
}

const EmployeePage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchEmployees = async () => {
    if (!token) return;
    const data = await baseFetch("/users", {}, token);
    setEmployees(data);
  };

  useEffect(() => {
    void fetchEmployees();
  }, [token]);

  const handleCreated = () => {
    showToast("Employee created successfully!", "success");
    void fetchEmployees();
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
              onClick={() => setShowNewModal(true)}
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
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.role}</td>
                <td>{new Date(emp.createdDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <NewEmployeeModal
          show={showNewModal}
          onHide={() => setShowNewModal(false)}
          token={token!}
          onCreated={handleCreated}
        />
      </Container>
    </>
  );
};

export default EmployeePage;
