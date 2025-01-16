import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaSearch, FaGlobeAmericas, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function Principal() {
  return (
    <>
      {/* Hero Section */}
      <div style={{
        backgroundImage: 'url(/avion.png)',
        backgroundSize: '80% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center', // Centra la imagen
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Una capa blanca semitransparente
        backgroundBlendMode: 'overlay', // Mezcla los colores de fondo y la imagen
      }} className="text-dark p-5 text-center mt-5">
        <Container>
          <h1>Bienvenido a Explora Aeropuertos</h1>
          <p className="lead mt-3">
            Encuentra información sobre aeropuertos de todo el mundo y navega por los detalles de tus próximos destinos.
          </p>
          <Button as={Link} to="/search" variant="primary" size="lg" className="mt-4">
            <FaSearch className="me-2" />
            Iniciar Búsqueda
          </Button>
        </Container>
      </div>

      {/* Características Destacadas */}
      <Container className="py-5">
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body style={{ backgroundColor: '#D9E3F1' }}>
                <FaGlobeAmericas size="3em" className="text-primary mb-3" />
                <Card.Title>Búsquedas globales</Card.Title>
                <Card.Text>
                  Encuentra información precisa sobre aeropuertos en cualquier parte del mundo.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body style={{ backgroundColor: '#D9E3F1' }}>
                <FaHistory size="3em" className="text-primary mb-3" />
                <Card.Title>Historial de búsquedas</Card.Title>
                <Card.Text>
                  Accede rápidamente a las búsquedas que has realizado recientemente.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body style={{ backgroundColor: '#D9E3F1' }}>
                <FaSearch size="3em" className="text-primary mb-3" />
                <Card.Title>Interfaz intuitiva</Card.Title>
                <Card.Text>
                  Diseñada para que puedas buscar y navegar sin complicaciones.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container className="text-center">
          <p className="mb-0">
            © 2025 Explora Aeropuertos. Todos los derechos reservados.
          </p>
        </Container>
      </footer>
    </>
  );
}

export default Principal;