const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const registerUser = async ({ username, email, password }) => {
  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (userExists) {
    const field = userExists.email === email ? 'email' : 'username';
    throw new Error(`El ${field} ya está registrado`);
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  return { user: user.toPublicJSON(), token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error('Credenciales inválidas');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new Error('Credenciales inválidas');

  if (!user.isActive) throw new Error('Usuario inactivo. Contacta al administrador');

  const token = generateToken(user._id);
  return { user: user.toPublicJSON(), token };
};

module.exports = { generateToken, registerUser, loginUser };