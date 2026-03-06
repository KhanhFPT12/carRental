const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

module.exports = (req,res,next)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message:"Access denied"});
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded = jwt.verify(token,JWT_SECRET);

        req.user = decoded;

        next();

    }catch(err){
        res.status(401).json({message:"Invalid token"});
    }
};