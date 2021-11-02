const firebase = require('./services/firebase/index');

const authMiddleware = (req, res, next) => {
    // Header token
    const headerToken = req.headers.authorization;
    if(!headerToken) 
        return res.send({message: "No token provided"}).status(401);
    if(headerToken?.split(" ")[0] !== 'Bearer')
        return res.send({message: "Invalid token. Expected Bearer"}).status(401);
    // Login
    const token = headerToken.split(" ")[1];
    firebase.auth().verifyIdToken(token)
        .then(async (decodedToken)=>{
            const doc = await firebase.firestore().collection('users').doc(decodedToken.uid).get();
            req.firebaseUser = doc.data();
            next();
        }) // If token is verified, continue
        .catch(()=>{
            res.send({message: "Unauthorized"}).status(403)
        })
}

module.exports = authMiddleware;
