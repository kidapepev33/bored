// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Funciones para interactuar con la API
const API = {
  // Funciones para juegos
  getGames: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/games`);
      if (!response.ok) {
        throw new Error('Error al obtener juegos');
      }
      const data = await response.json();
      return data.games;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  getGameById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener juego');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },

  // Funciones para usuarios
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
      
      const data = await response.json();
      // Guardar el token en localStorage para usarlo en futuras peticiones
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }
      
      const data = await response.json();
      // Guardar el token en localStorage para usarlo en futuras peticiones
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },

  // Funciones para pedidos
  createOrder: async (orderData) => {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      throw new Error('No autorizado - Inicie sesión primero');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear pedido');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getMyOrders: async () => {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      throw new Error('No autorizado - Inicie sesión primero');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener pedidos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
};
