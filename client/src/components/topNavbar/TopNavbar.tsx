import { useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { FaHome, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const isManager = user.role.includes("MANAGER");

  return (
    <Navbar bg="light" expand={false} className="py-2 shadow-sm">
      <Container
        fluid
        className="px-4 d-flex justify-content-between align-items-center"
      >
        <Nav className="d-flex flex-row align-items-center">
          <Button
            variant="link"
            className="text-dark d-flex align-items-center p-0 me-3"
            onClick={() => navigate("/")}
          >
            <span className="d-none d-md-inline fw-bold">Home</span>
            <FaHome className="d-inline d-md-none" size={20} />
          </Button>

          {isManager && (
            <Button
              variant="link"
              className="text-dark d-flex align-items-center p-0 me-3"
              onClick={() => navigate("/employees")}
            >
              <span className="d-none d-md-inline fw-bold">Employees</span>
              <FaUsers className="d-inline d-md-none" size={20} />
            </Button>
          )}
        </Nav>

        <div className="d-flex align-items-center">
          <span className="fw-bold me-2 d-none d-sm-inline">
            {user.firstName} {user.lastName}
          </span>

          <Dropdown show={showDropdown} onToggle={setShowDropdown}>
            <Dropdown.Toggle
              as={Button}
              variant="secondary"
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {initials}
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              <Dropdown.Header className="d-sm-none">
                {user.firstName} {user.lastName}
              </Dropdown.Header>

              <Dropdown.Item onClick={() => navigate("/me")}>
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
