const { verifyToken } = require('../services/authentication');

function checkForAuthenticationCookie(cookieName){
    return(req, res, next) =>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
    
        try{
            const userPayload = verifyToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error){
            console.log('Token verification failed:', error.message);

            res.clearCookie('token');
        }
            
        return next();
    }
}


module.exports = {
    checkForAuthenticationCookie
}