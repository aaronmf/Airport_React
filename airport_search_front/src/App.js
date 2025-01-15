import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { Modal, Button, Form, Card, InputGroup, Spinner, ListGroup, Offcanvas, Navbar, Nav } from 'react-bootstrap';
import { FaSearch, FaTrash, FaBars } from 'react-icons/fa'; 
import axios from 'axios'; 
import 'leaflet/dist/leaflet.css'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MAX_HISTORY_LENGTH = 5; // Límite de historial de búsqueda

function App() {
  // Estados principales: Búsqueda, resultados, historial, estado de carga, etc.
  const [searchTerm, setSearchTerm] = useState('');  
  const [airports, setAirports] = useState([]);  
  const [selectedAirport, setSelectedAirport] = useState(null); 
  const [showModal, setShowModal] = useState(false);  
  const [isLoading,] = useState(false);  
  const [history, setHistory] = useState([]);  
  const [airportCache, setAirportCache] = useState({});  
  const [alertVisible, setAlertVisible] = useState(false);  
  const [modalLoading, setModalLoading] = useState(false);  
  const [showOffcanvas, setShowOffcanvas] = useState(false); 
  const [showHistory, setShowHistory] = useState(false); 

  // Guarda el historial actualizado en localStorage cada vez que cambia el estado del historial
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('airportSearchHistory', JSON.stringify(history));
    }
  }, [history]);

  // Función para manejar cambios en el campo de búsqueda (input)
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);  
  };

  // Realiza la búsqueda de aeropuertos
  const handleSearch = async () => {
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 1000);

    // Verifica si los resultados ya están en la caché
    if (airportCache[searchTerm]) {
      setAirports(airportCache[searchTerm]);  
      return; 
    }

    // Hace la solicitud a la API para buscar aeropuertos
    try {
      const response = await axios.post('http://localhost:5000/search-airport', { airport: searchTerm });

      // Si encuentra resultados, los guarda en caché y los muestra
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

  // Agrega un término de búsqueda al historial y mantiene el límite máximo
  const addToHistory = (term) => {
    setHistory((prevHistory) => {
      const newHistory = [term, ...prevHistory.filter(item => item !== term)];
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.pop();  // Limita el historial a MAX_HISTORY_LENGTH elementos
      }
      return newHistory;
    });
  };

  // Maneja la selección de un término del historial
  const handleHistorySelect = (term) => {
    setSearchTerm(term); 
    if (airportCache[term]) {
      setAirports(airportCache[term]);  // Si los resultados están en caché, los carga directamente
    }
  };

  // Función para borrar el historial de búsqueda
  const handleClearHistory = () => {
    setHistory([]);  // Elimina el historial
    localStorage.removeItem('airportSearchHistory');  // Elimina el historial del almacenamiento local
  };

  // Función para mostrar los detalles de un aeropuerto en el modal
  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport); 
    setModalLoading(true);
    setShowModal(true);

    setTimeout(() => {
      setModalLoading(false); 
    }, 1000);
  };

  // Función para mostrar/ocultar el menú lateral (Offcanvas)
  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  // Función para alternar la visibilidad del historial
  const toggleHistoryVisibility = () => {
    setShowHistory(!showHistory);
  };

  return (
    <Router>
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

      {/* Definición de rutas */}
      <Routes>
        <Route path="/" element={<div className="p-5 text-center">Bienvenido a la página principal</div>} />
        <Route
          path="/search"
          element={
            <div className="d-flex justify-content-center flex-column align-items-center mt-5">
              {/* Modal de carga con el spinner */}
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

                {/* Botón para mostrar/ocultar el historial */}
                <Button variant="primary" onClick={toggleHistoryVisibility} className="mt-3" size="sm">
                  {showHistory ? 'Ocultar Historial' : 'Historial de Búsqueda'}
                </Button>

                {/* Card del historial que se muestra/oculta */}
                {showHistory && (
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

              {/* Resultados de la búsqueda */}
              {airports.length > 0 && (
                <Card className="mt-3 p-3 w-75">
                  <Card.Title>Resultados de la búsqueda</Card.Title>
                  <ListGroup as="ul">
                    {airports.map((airport) => (
                      <ListGroup.Item
                        as="li"
                        key={airport.iataCode}
                        action
                        onClick={() => handleAirportSelect(airport)} 
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
