var secureMe = require("../secure.me.js");
var express = require("express");
var expect = require("chai").expect;
var util = require("util");
var request = require("request");

describe("secure me #integration", function(){
  before(function(done){
    var app = express();
    var secure = secureMe();
    secure.setMiddlewares([freeMiddleware]);
    secure.setDefault(secMiddleware);
    function secMiddleware(req, res, next){
      if(req.query.pwd === "password"){
        req.user = "user";
        return next();
      }
      res.statusCode=403;
      return res.end("Unauthorized");
    }
    function freeMiddleware(req, res, next){
      req.user = "guest";
      return next();
    }
    
    app.get("/get-secure", success);
    app.get("/get-free", function(req, res, next){next()}, freeMiddleware, success);
    app.post("/post-secure", success);
    app.post("/post-free", function(req, res, next){next()}, freeMiddleware, success); 
    secure.secureRoutes(app);
    app.del("/del-secure", function(req, res, next){next()}, success);
    app.put("/put-free", freeMiddleware, success);
    function success (req, res, end){
      res.end("OK-" + req.user);
    }
    app.listen(2345);
    done();
    
  })
  it(" GET will fail without 'password' ", function(done){
    request.get("http://localhost:2345/get-secure", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(403);
      expect(body).to.equal("Unauthorized");
      done();
    }
  })
  it(" GET will pass with 'password'", function(done){
    request.get("http://localhost:2345/get-secure?pwd=password", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body).to.equal("OK-user");
      done();
    }
  })
  it(" GET FREE will just pass ", function(done){
    request.get("http://localhost:2345/get-free", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body).to.equal("OK-guest");
      done();
    }
  })
  it(" POST will fail without 'password' ", function(done){
    request.post("http://localhost:2345/post-secure", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(403);
      expect(body).to.equal("Unauthorized");
      done();
    }
  })
  it(" POST will pass with 'password'", function(done){
    request.post("http://localhost:2345/post-secure?pwd=password", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body).to.equal("OK-user");
      done();
    }
  })
  it(" POST FREE will just pass ", function(done){
    request.post("http://localhost:2345/post-free", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body).to.equal("OK-guest");
      done();
    }
  })
  it(" DEL will fail without 'password' ", function(done){
    request.del("http://localhost:2345/del-secure", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(403);
      expect(body).to.equal("Unauthorized");
      done();
    }
  })
  it(" DEL will pass with 'password'", function(done){
    request.del("http://localhost:2345/del-secure?pwd=password", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body).to.equal("OK-user");
      done();
    }
  })
  it(" PUT FREE will just pass ", function(done){
    request.put("http://localhost:2345/put-free", gotRequest);
    function gotRequest(err, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body).to.equal("OK-guest");
      done();
    }
  })
})
