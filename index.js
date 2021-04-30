const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const user = require('./controllers/user');
const validateJWT = require('./auth/validateJWT');
const validateUser = require('./middlewares/validateUser');
const validateGetAllRecipes = require('./auth/validateGetAllRecipes');

const recipeIdRoute = '/recipes/:id';

const app = express();
app.use(express.static(`${__dirname}/uploads`));
app.use(bodyParser.json());

const PORT = 3000;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});
//  code from trybe-course
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'uploads');
//   },
//   filename: (req, file, callback) => {
//     callback(null, `${req.params.id}.${file.mimetype.split('/')[1]}`);
//   } });

//  const upload = multer({ storage });

app.post('/users', user.create);
app.post('/login', validateUser, user.login);
app.post('/recipes', validateJWT, user.createRecipes);
app.get('/recipes', validateGetAllRecipes, user.getAllRecipes);
app.get(recipeIdRoute, validateGetAllRecipes, user.findRecipeById);
app.delete(recipeIdRoute, validateJWT, user.deleteRecipeById);
app.put(recipeIdRoute, validateJWT, user.updateRecipeById);
// app.put('/recipes/:id/image/', validateJWT, upload.single('image'), user.addImageToRecipe);

app.listen(PORT, () => { console.log('API rodando na porta 3000'); });