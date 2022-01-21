var jwt = require("jsonwebtoken");
var secret = process.env.SECRET;

module.exports = (req,res,next) => {
   const authToken = req.headers['authorization'];
   if(authToken != undefined) {
        const bearer = authToken.split(' ');
        var token = bearer[1];

    try {
        var infDec = jwt.verify(token,secret);
        if(infDec.role == 1) {
            next();      
        }else{
            res.status(403);
            res.send("You do not have permission to access this page.")
            return;
        }
        
    } catch (err) {
        res.status(403);
        res.send("User not authenticated.")
        return;
    }   
     }else{
       res.status(403);
       res.send("User not authenticated.")
       return;
   } 
}