const authService = require('../services/authService');

const getMe = (req, res) => {
  res.status(200).json({ user: authService.sanitizeUser(req.user) });
};

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to register user' });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to log in' });
  }
};

module.exports = {
  getMe,
  register,
  login,
};
