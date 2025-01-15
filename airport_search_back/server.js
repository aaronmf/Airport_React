const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Para gestionar las variables de entorno (API_KEY, API_SECRET)

const app = express();
app.use(cors());
app.use(express.json()); // Para manejar JSON en las solicitudes

// Ruta para obtener el access token
const getAccessToken = async () => {
  const authData = new URLSearchParams();
  authData.append('grant_type', 'client_credentials');
  authData.append('client_id', process.env.AMADEUS_API_KEY);
  authData.append('client_secret', process.env.AMADEUS_API_SECRET);

  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', authData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    throw error;
  }
};

// Ruta para buscar aeropuertos
app.post('/search-airport', async (req, res) => {
  const { airport } = req.body;
  
  if (!airport) {
    return res.status(400).json({ error: 'Se debe proporcionar el nombre del aeropuerto.' });
  }

  try {
    // Paso 1: Obtener el access token
    const token = await getAccessToken();

    // Paso 2: Hacer la solicitud de búsqueda a la API de Amadeus
    const searchParams = {
      subType: 'AIRPORT',
      keyword: airport,
      'page[limit]': 10
    };

    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: searchParams
    });

    // Enviar la respuesta con los datos de los aeropuertos
    res.json(response.data);
  } catch (error) {
    console.error('Error al buscar aeropuerto:', error);
    res.status(500).json({ error: 'Error en la búsqueda de aeropuerto.' });
  }
});

// Configuración del servidor para escuchar en el puerto 5000
app.listen(5000, () => {
  console.log('Servidor ejecutándose en http://localhost:5000');
});
