const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('./models/user');
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');
const config=require('./config');



exports.local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,{
        expiresIn:3600
    });
}

const opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;


exports.jwtPassport=passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    console.log("JWT Payload: ",jwt_payload);
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err){
            return done(err,false);
        }
        else if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    })
}));


exports.verifyUser = (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        console.log(token);
        jwt.verify(token,config.secretKey,(err,decoded)=>{
            if(err){
                const err=new Error('You are not authenticated!');
                err.status=401;
                return next(err);
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
    else{
        const err=new Error('No token provided!');
        err.status=403;
        return next(err);
    }
};

exports.verifyAdmin=(req,res,next)=>{
    if(req.user.admin) {
        next();
    }
    else{
        var err=new Error('You are not authorized to perform this operation!');
        err.status=403;
        return next(err);
    }
}