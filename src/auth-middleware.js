const firebase = require('../firebase/index');
const userService = require('../services/userService');

const authMiddleware = (req, res, next) => {
    // Header token
    const headerToken = req.headers.authorization;
    if(!headerToken || headerToken?.split(" ")[0] !== 'Bearer'){
        // return res.send({message: "Invalid token."}).status(401);
        req.firebaseLoginError = 'Invalid token.';
        return next();
    }
    // Login
    const token = headerToken.split(" ")[1];
    firebase.auth().verifyIdToken(token)
        .then(async (decodedToken)=>{
            const doc = await firebase.firestore().collection('users')
                .doc(decodedToken.uid)
                .withConverter(userService.converter).get();
            req.firebaseUser = doc.data();
            next();
        }) // If token is verified, continue
        .catch((e)=>{
            req.firebaseLoginError = e;
            next();
        })
}

module.exports = authMiddleware;
