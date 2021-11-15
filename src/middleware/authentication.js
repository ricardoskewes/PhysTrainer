const firebase = require('../../firebase/index')

/**
 * Express middleware to handle logins
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const login = async (req, res, next)=>{
    // Get user token from body
    const userToken = req.body.userToken?.toString();
    if(userToken == undefined) res.status(400).json({error: 'A user token is needed'});
    // Set expiration time (ms * s * min * h * d)
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    // Try to create a session cookie
    try{
        const sessionCookie = await firebase.auth().createSessionCookie(userToken, {expiresIn});
        // Set cookie
        res.cookie('session', sessionCookie, {
            maxAge: expiresIn, 
            httpOnly: true
        })
        // Go to next
        next();
    } catch(e){
        res.status(400).json({error: "Unauthorized request"})
    }
}

/**
 * Express middleware to handle logouts
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const logout = (req, res, next)=>{
    res.clearCookie('session');
    next();
}


const verify = async (req, res, next)=>{
    // Get session cookie
    const sessionCookie = req.cookies.session;
    // Try to get user
    try{
        req.firebaseUser = await firebase.auth().verifySessionCookie(sessionCookie, true);
    } catch(e){

    }
    next();
}

const authenticationMiddleware = {login, verify, logout};

module.exports = authenticationMiddleware;