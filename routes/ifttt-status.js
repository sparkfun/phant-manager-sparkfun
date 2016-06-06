

var express = require('express');

var iftttRouter = express.Router(); //Mini application under express



iftttRouter.route('/')
.all(function(req,res,next){
  res.writeHead(200,{ 'Content-Type': 'text/plain'});
  next();
})

.get(function(req,res,next){
  res.end('TEST!');
});




module.exports = iftttRouter;
