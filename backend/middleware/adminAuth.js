import jwt from 'jsonwebtoken';

const adminAuth = async(req, res, next) => {
    try{
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET environment variable is not set');
            return res.status(500).json({success: false, message: "Server configuration error"});
        }

        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'Not set');

        const token = req.headers.token;
        if(!token){
            console.log('No token provided in adminAuth');
            return res.json({success: false, message: "Not Authorized Login Again"});
        }
        
        console.log('Token received in adminAuth:', token.substring(0, 20) + '...');
        console.log('Full token length:', token.length);
        console.log('Token parts count:', token.split('.').length);
        
        try{
            console.log('Attempting JWT verification');
            const decoded=jwt.verify(token, process.env.JWT_SECRET);
            console.log('JWT verification successful');
            console.log('Decoded token:', decoded);
            
            req.user={ id: decoded.id };
            console.log('Set req.user.id to:', req.user.id);
            
            next();
        } 
        catch(jwtError){
            console.error('JWT verification failed:', jwtError.message);
            console.error('JWT error name:', jwtError.name);
            console.error('JWT error stack:', jwtError.stack);
            
            if(jwtError.name==='JsonWebTokenError'){
                return res.json({success: false, message: "Invalid token format"});
            } 
            else if(jwtError.name==='TokenExpiredError'){
                return res.json({success: false, message: "Token expired, please login again"});
            } 
            else{
                return res.json({success: false, message: "Token verification failed"});
            }
        }
    }
    catch(error){
        console.log('Error in adminAuth:', error);
        res.json({success: false, message: "Not Authorized Login Again"})
    }
}
export default adminAuth;