const jwt=require('jsonwebtoken');
const authMiddleware=async (req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({error:"Header not provided!"});
        return;
    }
    const token=authHeader.split(' ')[1];
    try{
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        res.status(401).json({error:"Not authorized to access this route"});
        return;
    }
}
module.exports=authMiddleware;