const { cookie } = require('./cookies');
const context = ({ res, req }) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  return {
    req,
    res,
    cookie,
  }
};

module.exports = {
  context
}