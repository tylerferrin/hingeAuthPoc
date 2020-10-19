const { serialize } = require("cookie");


/**
 * This sets `cookie` on `res` object
 */
const cookie = (res, name, value, options = {}) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    console.log("stringValue", stringValue);

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
}

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const cookies = (handler) => (req, res) => {
  cookie = (name, value, options) => cookie(res, name, value, options)

  return handler(req, res)
}

module.exports = {
  cookie,
};