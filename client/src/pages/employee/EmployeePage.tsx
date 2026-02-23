import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";
import TopNavbar from "../../components/topNavbar/TopNavbar";
import { useAuth } from "../../context/AuthContext";

interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  createdDate: string;
}

const EmployeePage = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token) return;

      const data = await baseFetch("/users", {}, token);
      setEmployees(data);
    };

    void fetchEmployees();
  }, [token]);

  return (
    <>
      <TopNavbar />
      <Container className="p-4">
        <h3>Employees</h3>
        <hr />

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
      </Container>
    </>
  );
};

export default EmployeePage;
