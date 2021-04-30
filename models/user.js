const { ObjectId } = require('mongodb');
const connection = require('./connection');

const findByEmail = async (email) =>
 connection().then((db) => db.collection('users').findOne({ email }));

const findByUser = async (name) =>
connection().then((db) => db.collection('users').findOne({ name }));

const deleteRecipeById = async (id) =>
connection().then((db) => db.collection('recipes').deleteOne({ _id: ObjectId(id) }));

const findRecipeById = async (id) =>
   connection()
    .then((db) => db.collection('recipes').findOne(new ObjectId(id)));

const getAllRecipes = async () =>
connection().then((db) => db.collection('recipes').find().toArray());
const create = async (email, password, name, role) =>
  connection()
    .then((db) =>
      db.collection('users').insertOne({ name, email, password, role })).then((result) => result);

const createRecipes = async (name, ingredients, preparation, userId) =>
  connection()
        .then((db) =>
          db.collection('recipes')
          .insertOne({ name, ingredients, preparation, userId })).then((result) => result);

const updateRecipeById = async (name, ingredients, preparation, id) =>
      connection()
        .then((db) =>
            db.collection('recipes').updateOne({ _id: new ObjectId(id) },
              { $set: { name, ingredients, preparation } })).then((result) => result);
const addImageToRecipe = async (objRecipeData, id) =>
            connection()
              .then((db) =>
                  db.collection('recipes').updateOne({ _id: new ObjectId(id) },
                    { $set: { ...objRecipeData } })).then((result) => result);

module.exports = {
addImageToRecipe,
updateRecipeById,
deleteRecipeById,
findRecipeById,
getAllRecipes,
createRecipes,
findByUser,
findByEmail,
create,
};