import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function Navigationbar() {
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/game">Tic-Tac-Toe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              {localStorage.getItem("authToken") ? (
                <NavDropdown.Item href="/">User Profile</NavDropdown.Item>
              ) : (
                <NavDropdown.Item href="/register">Register</NavDropdown.Item>
              )}
              {localStorage.getItem("authToken") ? (
                <NavDropdown.Item onClick={() => logoutHandler()} href="/">
                  Logout
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;
