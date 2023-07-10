const jwt = require("jsonwebtoken");

exports.extractIdFromAuthorizationHeader = (authorizationHeader) => {
  try {
    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decodedToken.id;
    return senderId;
  } catch (err) {
    console.error(`Error extracting ID from authorization header: ${err}`);
    return null; // or throw a custom error
  }
};
