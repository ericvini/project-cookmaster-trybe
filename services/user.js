const { ObjectId } = require('mongodb');
const user = require('../models/user'); 

const errInvalidEntries = { 
  message: 'Invalid entries. Try again.',
 };
const errEmailAlreadyRegistered = {
  conflict: 409,
};
const errFieldsMustBeFilled = {
  FieldsMustBeFilled: 'All fields must be filled',
};

const errIncorrectUserNameOrPassword = {
  IncorrectUserNameOrPassword: 'Incorrect username or password',
};

const errRecipeNotFound = {
  message: 'recipe not found',
};
const verifyName = (name) => {
  if (!name || typeof name !== 'string') return false;

  return true;
};
const isEmailAlreadyExist = async (email) => {
  const result = await user.findByEmail(email);
  return result;
};
const verifyEmail = (email) => {
  const reg = /\S+@\S+\.\S+/;
  if (!email || typeof email !== 'string') return false;
  if (!reg.test(email)) return false; 

  return true;
};
const verifyEmailLogin = (email) => {
  const reg = /\S+@\S+\.\S+/;
  if (!email || typeof email !== 'string') return errFieldsMustBeFilled;
  if (!reg.test(email)) return errIncorrectUserNameOrPassword; 

  return true;
};
const verifyPasswordLogin = (password) => {
  if (!password) return errFieldsMustBeFilled;
  if (typeof password !== 'string') return errIncorrectUserNameOrPassword;

  return true;
};
const verifyPassword = (password) => {
  if (!password || typeof password !== 'string') return false;

  return true;
};
const isValid = async (email, password, name) => {
  const result = await isEmailAlreadyExist(email);
  if (!verifyName(name)) return errInvalidEntries;
  if (!verifyEmail(email)) return errInvalidEntries;
  if (!verifyPassword(password)) return errInvalidEntries;
  if (result !== null) return errEmailAlreadyRegistered;

  return true;
};
const validateLogin = async (email, password) => {
  const resultverifyEmailLogin = verifyEmailLogin(email);
  const resultverifyPasswordLogin = verifyPasswordLogin(password);
  if (resultverifyEmailLogin !== true) return resultverifyEmailLogin;
  if (resultverifyPasswordLogin !== true) return resultverifyPasswordLogin;
  
  return true;
};
const verifyNameRecipe = (name) => {
  if (!name) return errInvalidEntries;

  return true;
};

const verifyIngredientsRecipe = (ingredients) => {
  if (!ingredients) return errInvalidEntries;

  return true;
};

const verifyPreparationRecipe = (preparation) => {
  if (!preparation) return errInvalidEntries;

  return true;
};
const validateRecipe = async (name, ingredients, preparation) => {
  const resultverifyNameRecipe = verifyNameRecipe(name);
  const resultverifyIngredientsRecipe = verifyIngredientsRecipe(ingredients);
  const resultverifyPreparationRecipe = verifyPreparationRecipe(preparation);
  if (resultverifyNameRecipe !== true) return resultverifyNameRecipe;
  if (resultverifyIngredientsRecipe !== true) return resultverifyIngredientsRecipe;
  if (resultverifyPreparationRecipe !== true) return resultverifyPreparationRecipe;
  
  return true;
};
const findRecipeById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return errRecipeNotFound;
  }
  const result = await user.findRecipeById(id);

  if (result === null) return errRecipeNotFound;

  return result;
};

  const create = async (email, password, name) => {
  const role = 'user';
  const InvalidEntries = await isValid(email, password, name);

  if (typeof InvalidEntries === 'object') return InvalidEntries;

  const { insertedId } = await user.create(email, password, name, role);

  return {
    
      user: {
        name,
        email,
        role: 'user',
        _id: insertedId,
      },
    
  };
};
const getAllRecipes = async () => {
  const recipes = await user.getAllRecipes();
  return recipes;
};
const getUserId = async ({ name }) => {
  const userData = await user.findByUser(name);
  return userData;
};
const deleteRecipeById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return errRecipeNotFound;
  }
  const result = await user.findRecipeById(id);

  if (result === null) return errRecipeNotFound;

  await user.deleteRecipeById(id);

  return result;
};
const createRecipes = async (name, ingredients, preparation, data) => {
  const InvalidEntries = await validateRecipe(name, ingredients, preparation);

  if (typeof InvalidEntries === 'object') return InvalidEntries;

  const userData = await getUserId(data);
  const { _id: idUser } = userData;
  const id = idUser.toString();
  const { insertedId } = await user.createRecipes(name, ingredients, preparation, id);
  return {    
      recipe: {
        name,
        ingredients,
        preparation,
        userId: id,
        _id: insertedId,
      },
    
  };
};

const updateRecipeById = async (objRecipeData) => {  
  const { name, ingredients, preparation, id, userId } = objRecipeData;
  if (!ObjectId.isValid(id)) {
    return errRecipeNotFound;
  }
  const result = await validateRecipe(name, ingredients, preparation);

  if (typeof result === 'object') return errRecipeNotFound;

  await user.updateRecipeById(name, ingredients, preparation, id);

  return {
    _id: id,
    name,
    ingredients, 
    preparation, 
    userId,
  };
};
const addImageToRecipe = async (objRecipeData) => {  
  const { name, ingredients, preparation, id, userId, image } = objRecipeData;
  if (!ObjectId.isValid(id)) {
    return errRecipeNotFound;
  }

  if (typeof result === 'object') return errRecipeNotFound;

  await user.addImageToRecipe(objRecipeData, id);

  return {
    _id: id,
    name,
    ingredients, 
    preparation, 
    userId,
    image,
  };
};

module.exports = {
  addImageToRecipe,
  updateRecipeById,
  deleteRecipeById,
  findRecipeById,
  getAllRecipes,
  createRecipes,  
  isEmailAlreadyExist,
  validateLogin,
  create,
};