const express = require('express');
const bodyParser = require('body-parser');
const authenticate=require('../authenticate');

const leaderRouter = express.Router();
const Leaders=require('../models/leaders');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    Leaders.create(req.body)
    .then((leader)=>{
        console.log("Leader Added");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.deleteMany({})
    .then((response)=>{
        console.log("Leaders Removed");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    },(err)=>next(err))
    .catch((err)=>next(err));
});



leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode=403;
    res.end(`Post operation not supported on ${req.params.leaderId}`);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((response)=>{
        console.log("Leader Removed");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = leaderRouter;