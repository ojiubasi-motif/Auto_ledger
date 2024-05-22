import jwt from 'jsonwebtoken';

function verify(req, res, next){
    const authHeader = req.headers.token;
    if(authHeader){
        
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if(err) return res.status(403).json({msg:"your token is invalid",type:"INVALID_CREDENTIAL",code:602});
            req.user = user
            next();//continue execution after verification
        })
    }else{ 
        return res.status(401).json({msg:"you do not have a token",type:"INCOMPLETE_DATA",code:605});
    }
}

export default verify