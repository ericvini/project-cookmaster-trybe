const user = require('../services/user');

const UNAUTHORIZED = 401;
const validateUser = async (req, res, next) => {  
  const { email, password } = req.body;
  const resultvalidation = await user.validateLogin(email, password);

  if (resultvalidation.FieldsMustBeFilled) {
    return res.status(UNAUTHORIZED).json({ message: 'All fields must be filled' });
  } 
  const MatchUserInDataBase = await user.isEmailAlreadyExist(email);
  console.log(MatchUserInDataBase);
  if (MatchUserInDataBase === null) {    
    return res.status(UNAUTHORIZED).json({ message: 'Incorrect username or password' });
  }

  if (resultvalidation.IncorrectUserNameOrPassword
    || MatchUserInDataBase.password !== password) {
    return res.status(UNAUTHORIZED).json({ message: 'Incorrect username or password' });
  }  
  req.name = MatchUserInDataBase.name;
  next();
};

module.exports = validateUser;