const jwt = require('jsonwebtoken');
const user = require('../services/user');
const modelUser = require('../models/user');

const CREATED = 201;
const BAD_REQUEST = 400;
const CONFLICT = 409;
const OK = 200;
const NOT_FOUND = 404;
const NOT_CONTENT = 204;

const secret = 'meutoken';

const jwtConfig = {
  expiresIn: '1h',
  algorithm: 'HS256',
};

const login = async (req, res) => {
  const { email } = req.body;

  const userData = await modelUser.findByEmail(email);  
  
  const token = jwt.sign({ data: userData }, secret, jwtConfig);
 return res.status(OK).json({ token });
};

const create = async (req, res) => {
  const { email, password, name } = req.body;

  const result = await user.create(email, password, name);

  if (result.message) return res.status(BAD_REQUEST).json(result);

  if (result.conflict) return res.status(CONFLICT).json({ message: 'Email already registered' });

 return res.status(CREATED).json(result);
};
const findRecipeById = async (req, res) => {
  const { id } = req.params;

  const result = await user.findRecipeById(id);

  if (result.message) return res.status(NOT_FOUND).json(result);

  return res.status(OK).json(result);
};
const deleteRecipeById = async (req, res) => {
  const { id } = req.params;

  const result = await user.deleteRecipeById(id);

  if (result.message) return res.status(NOT_FOUND).json(result);

 return res.status(NOT_CONTENT).json(result);
};
const getAllRecipes = async (req, res) => {
  const { authorization } = req.headers;
  const result = await user.getAllRecipes();

  if (authorization) {
  return res.status(OK).json(result);
  }

 return res.status(OK).json(result);
};
const createRecipes = async (req, res) => {
  const { name, ingredients, preparation, data } = req.body;
  const result = await user.createRecipes(name, ingredients, preparation, data);

  if (result.message) return res.status(BAD_REQUEST).json(result);

 return res.status(CREATED).json(result);
};
const updateRecipeById = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.body.data;
  const { name, ingredients, preparation, data } = req.body;
  const resultmodel = await user.findRecipeById(id);
  const { userId } = resultmodel;
  let result = '';
  if (String(userId) === String(_id) || data.role === 'admin') {
    const objRecipeData = { name, ingredients, preparation, id, userId };
    result = await user.updateRecipeById(objRecipeData);
  }

  if (result.message) return res.status(NOT_FOUND).json(result);

  if (result === '') return res.status(NOT_FOUND).json({ message: 'recipe not found' });

return res.status(OK).json(result);
};
// const addImageToRecipe = async (req, res) => {
//   const { id } = req.params;
//   const { data } = req.body;
//   const { _id } = data;  
//   const resultmodel = await user.findRecipeById(id);
//   const { userId } = resultmodel;
//   let result = '';
//   if (String(userId) === String(_id) || data.role === 'admin') {
//     const image = `localhost:3000/images/${id}.jpeg`;
//     const objRecipeData = { ...resultmodel, image };
//     result = await user.addImageToRecipe(objRecipeData);
//   }
  
//   if (result.message) return res.status(NOT_FOUND).json(result);

//   if (result === '') return res.status(NOT_FOUND).json({ message: 'recipe not found' });
 
//   res.status(OK).json(result);
// };

module.exports = {
  // addImageToRecipe,
  updateRecipeById,
  deleteRecipeById,
  findRecipeById,
  getAllRecipes,
  createRecipes,
  login,
  create,
};
