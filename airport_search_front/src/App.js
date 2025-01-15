import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Modal, Button, Form, Card, InputGroup, Spinner, ListGroup, Offcanvas, Navbar, Nav } from 'react-bootstrap';
import { FaSearch, FaTrash, FaBars } from 'react-icons/fa';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MAX_HISTORY_LENGTH = 5;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [airportCache, setAirportCache] = useState({});
  const [alertVisible, setAlertVisible] = useState(false); // Control de visibilidad del modal de búsqueda
  const [modalLoading, setModalLoading] = useState(false);  // Control de la carga dentro del modal
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('airportSearchHistory')) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('airportSearchHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    setAlertVisible(true); // Mostrar el modal al iniciar la búsqueda

    // Simular el retraso de 1 segundo para mostrar el spinner en el modal
    setTimeout(() => {
      setAlertVisible(false); // Ocultar el modal después de 1 segundo
    }, 1000);  // 1 segundo

    if (airportCache[searchTerm]) {
      setAirports(airportCache[searchTerm]);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/search-airport', { airport: searchTerm });

      if (response.data.data.length > 0) {
        const newAirports = response.data.data;
        setAirportCache((prevCache) => ({
          ...prevCache,
          [searchTerm]: newAirports,
        }));
        setAirports(newAirports);
        addToHistory(searchTerm);
      } else {
        alert('No se encontraron aeropuertos con ese término.');
      }
    } catch (error) {
      console.error('Error al buscar aeropuertos:', error);
      alert('Ocurrió un error al realizar la búsqueda.');
    }
  };

  const addToHistory = (term) => {
    setHistory((prevHistory) => {
      const newHistory = [term, ...prevHistory.filter(item => item !== term)];
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.pop();
      }
      return newHistory;
    });
  };

  const handleHistorySelect = (term) => {
    setSearchTerm(term);
    if (airportCache[term]) {
      setAirports(airportCache[term]);
    } else {
      setAirports([]);
      handleSearch();
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('airportSearchHistory');
  };

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
    setModalLoading(true); // Cargar cuando seleccionas el aeropuerto
    setShowModal(true);

    // Simular retardo para la carga en el modal
    setTimeout(() => {
      setModalLoading(false); // Después de 1 segundo detener el loading
    }, 1000);
  };

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  return (
    <Router>
      {/* Header con Navbar y Offcanvas */}
      <Navbar bg="light" expand={false} className="mb-4">
        <Navbar.Brand as={Link} to="/" className="ms-3">
          Mi Aplicación
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
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={toggleOffcanvas}>
                Página Principal
              </Nav.Link>
              <Nav.Link as={Link} to="/search" onClick={toggleOffcanvas}>
                Búsqueda
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>
      <Routes>
        <Route path="/" element={<div className="p-5 text-center">Bienvenido a la página principal</div>} />
        <Route
          path="/search"
          element={
            <div className="d-flex justify-content-center flex-column align-items-center mt-5">
              {/* Modal con solo el spinner cuando buscamos un aeropuerto */}
              <Modal
                show={alertVisible}
                centered
                backdrop="static"
                keyboard={false}
              >
                <Modal.Body style={{ textAlign: 'center', padding: '40px 60px' }}>
                  <Spinner animation="border" variant="primary" size="lg" />
                </Modal.Body>
              </Modal>

              <Card className="p-3 w-75">
                <Card.Title>Busca un aeropuerto</Card.Title>
                <Card.Body>
                  <InputGroup>
                    <Form.Control
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Introduce un término de búsqueda"
                      disabled={isLoading}
                    />
                    <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                          Buscando...
                        </>
                      ) : (
                        <>
                          <FaSearch /> Buscar
                        </>
                      )}
                    </Button>
                  </InputGroup>
                </Card.Body>

                {/* Historial de búsquedas */}
                {history.length > 0 && (
                  <Card className="mt-3">
                    <Card.Body>
                      <Card.Title>Historial de búsquedas</Card.Title>
                      <ListGroup as="ul">
                        {history.map((term, index) => (
                          <ListGroup.Item as="li" key={index} action onClick={() => handleHistorySelect(term)}>
                            {term}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      <Button variant="danger" className="mt-2" onClick={handleClearHistory}>
                        <FaTrash /> Borrar Historial
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </Card>

              {/* Resultados de búsqueda */}
              {airports.length > 0 && (
                <Card className="mt-3 p-3 w-75">
                  <Card.Title>Resultados de la búsqueda</Card.Title>
                  <ListGroup as="ul">
                    {airports.map((airport) => (
                      <ListGroup.Item
                        as="li"
                        key={airport.iataCode}
                        action
                        onClick={() => handleAirportSelect(airport)}  // Muestra el modal
                      >
                        {airport.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}

              {/* Modal con los detalles del aeropuerto */}
              {selectedAirport && (
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                  <Modal.Header closeButton>
                    <Modal.Title>{selectedAirport.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {modalLoading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <Spinner animation="border" variant="primary" size="lg" />
                      </div>
                    ) : (
                      <>
                        <p><strong>Código IATA:</strong> {selectedAirport.iataCode}</p>
                        <p><strong>Ciudad:</strong> {selectedAirport.address?.cityName || "N/A"}</p>
                        <p><strong>País:</strong> {selectedAirport.address?.countryName || "N/A"}</p>
                        <p>
                          <strong>Coordenadas:</strong>
                          {selectedAirport.geoCode.latitude}, {selectedAirport.geoCode.longitude}
                        </p>
                        <div style={{ height: '400px' }}>
                          <MapContainer
                            center={[
                              selectedAirport.geoCode.latitude,
                              selectedAirport.geoCode.longitude,
                            ]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker
                              position={[
                                selectedAirport.geoCode.latitude,
                                selectedAirport.geoCode.longitude,
                              ]}
                            >
                              <Popup>{selectedAirport.name}</Popup>
                            </Marker>
                          </MapContainer>
                        </div>
                      </>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;