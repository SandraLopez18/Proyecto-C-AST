const axios = require('axios');

// Función para obtener el rol del usuario desde el microservicio de usuarios
async function obtenerRolUsuario(userId) {
  try {
    const response = await axios.get(`http://localhost:3001/api/usuarios/${userId}/rol`);
    return response.data.rol;
  } catch (error) {
    return null;
  }
}

module.exports = { obtenerRolUsuario };