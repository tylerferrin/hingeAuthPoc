const { cookie } = require('../cookies');

function login(_, { tokenString } , { res }) {
  console.log("tokenString", tokenString);
  if (isValidGoogleToken(tokenString)) {
    // create JWT, JWT Expiry, RefreshToken
    // set response cookie
    cookie(res, "refreshCookie", "topSecret", {
      maxAge: 10000,
      path: '/',
      httpOnly: true
    });

    // Return JWT, and JWT EXPIRY
    return JSON.stringify({
      token: "firstJwt",
      expiry: 5
    });
  }
}

function logout(_, { email }, { res }) {
  res.clearCookie('refreshCookie');
  // destroy refreshTokens in Redis
  // invalidate JWT in authService
  console.log("logout called");
  console.log(`All tokens associated with ${email} have been destroyed`);
  return Promise.resolve({
    token: '',
    expiry: 0,
  });
};

function refreshTokenSilently(_, { googleEmail }, { req, res }) {
  const validRefreshCookie = validateRefreshCookie(req);
  const hasGoogleAuth = isValidGoogleToken(googleEmail);
  if (validRefreshCookie && hasGoogleAuth) {
    const token = {
        token: "newJWT",
        expiry: 5
      } 
    return token;
  }
  return new Error("NO COOKIES FOR YOU");
}

const validateRefreshCookie = (req) => {
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split("; ");
    const refreshCookie = cookies.find((cookie) => {
      return cookie.includes("refreshCookie=");
    });

    if (refreshCookie) {
      const splitCookie = refreshCookie.split("=");
      if (splitCookie[1] === 'topSecret') {
        return true;
      }
    }
  }
  return false;
}

const isValidGoogleToken = (email) => {
  if (email === "tyler@bughunt.us") {
    return true;
  } 
  return false;
};


module.exports = {
  login,
  logout,
  refreshTokenSilently
}