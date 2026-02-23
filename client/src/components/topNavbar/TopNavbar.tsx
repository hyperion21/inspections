import { useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Navbar bg="light" expand={false} className="py-2 shadow-sm">
      <Container
        fluid
        className="px-4 d-flex justify-content-end align-items-center"
      >
        <Nav className="me-2 d-none d-sm-flex align-items-center">
          <span className="fw-bold">
            {user.firstName} {user.lastName}
          </span>
        </Nav>

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

            <Dropdown.Item>Edit Profile</Dropdown.Item>
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
