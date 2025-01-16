import React from 'react';
import { Navbar, Offcanvas, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';

function Header({ toggleOffcanvas, showOffcanvas }) {
  return (
    <>
      <Navbar expand={false} className="" style={{ backgroundColor: '#A2BAD4' }}>
        <Navbar.Brand as={Link} to="/" className="ms-3">
          Explora Aeropuertos
        </Navbar.Brand>
        <Button
          variant="outline-primary"
          onClick={toggleOffcanvas}
          className="ms-auto"
          style={{ border: 'none', backgroundColor: 'transparent' }}
        >
          <FaBars size="1.5em" />
        </Button>
        <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas}>
          <Offcanvas.Header closeButton style={{ backgroundColor: '#A2BAD4' }}>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Container
                style={{
                  backgroundColor: '#D9E3F1',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #b0c4de', // Borde sutil
                  borderRadius: '8px', // Bordes ligeramente redondeados
                  transition: 'background-color 0.3s ease', // Transición suave
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c5d4e7'} // Oscurecer al pasar el cursor
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D9E3F1'} // Volver al color original
              >
                <Nav.Link as={Link} to="/" onClick={toggleOffcanvas} style={{ fontWeight: 'bold', color: '#3c4f65' }}>
                🏡 Home
                </Nav.Link>
              </Container>
              <Container
                style={{
                  backgroundColor: '#D9E3F1',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #b0c4de', // Borde sutil
                  borderRadius: '8px', // Bordes ligeramente redondeados
                  transition: 'background-color 0.3s ease', // Transición suave
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c5d4e7'} // Oscurecer al pasar el cursor
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D9E3F1'} // Volver al color original
              >
                <Nav.Link as={Link} to="/search" onClick={toggleOffcanvas} style={{ fontWeight: 'bold', color: '#3c4f65' }}>
                🔍 Búsqueda
                </Nav.Link>
              </Container>
            </Nav>
          </Offcanvas.Body>

        </Offcanvas>
      </Navbar>
    </>
  );
}

export default Header;
