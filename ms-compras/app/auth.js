const axios = require('axios');

async function obtenerRolUsuario(userId) {
  try {
    const response = await axios.get(`http://localhost:3001/api/usuarios/${userId}/rol`);
    return response.data.rol;
  } catch (error) {
    if (error.response) {
      console.error('ERROR auth.js:', error.response.status, error.response.data);
    } else {
      console.error('ERROR auth.js:', error.message);
    }
    return null;
  }
}

module.exports = { obtenerRolUsuario };