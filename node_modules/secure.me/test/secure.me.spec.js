var secureMe = require("../secure.me.js");
var express = require("express");
var expect = require("chai").expect;
var util = require("util");

describe("secure me unit", function(){
  it("secure.secureRoutes(app); will add default middleware for all endpoints", function(done){
    var app = express();
    var secure = secureMe();
    secure.setMiddlewares([freeMiddleware]);
    secure.setDefault(secMiddleware);
    function secMiddleware(req, res, next){}
    function freeMiddleware(req, res, next){}
    
    app.get("/get", function(){});
    app.post("/post", function(){});
    secure.secureRoutes(app);
    app.del("/del", function(){});
    app.put("/put", function(){});
    expect(app.routes.get[0].callbacks[0]).to.equal(secMiddleware);
    expect(app.routes.post[0].callbacks[0]).to.equal(secMiddleware);
    expect(app.routes.delete[0].callbacks[0]).to.equal(secMiddleware);
    expect(app.routes.put[0].callbacks[0]).to.equal(secMiddleware);
    done();
  })
  it(" secure.sequreRoutes(app) will sequre all endpoints besides those that have specific middleware defined", function(done){
    var app = express();
    var secure = secureMe();
    secure.setMiddlewares([freeMiddleware, someOtherMiddleware]);
    secure.setDefault(secMiddleware);
    function secMiddleware(req, res, next){}
    function someOtherMiddleware(req, res, next){}
    function freeMiddleware(req, res, next){}
    
    app.get("/get", function(){});
    app.post("/post", function(){}, freeMiddleware);
    secure.secureRoutes(app);
    app.del("/del", function(){});
    app.put("/put", freeMiddleware, function(){});
    expect(app.routes.get[0].callbacks[0]).to.equal(secMiddleware);
    expect(app.routes.post[0].callbacks[0]).to.not.equal(secMiddleware);
    expect(app.routes.delete[0].callbacks[0]).to.equal(secMiddleware);
    expect(app.routes.put[0].callbacks[0]).to.not.equal(secMiddleware);
    done();
  })
  it(" secure.signer can sign and validate objects", function(done){
    var signer = secureMe().signer({salt:"abcd"});
    var secureobj = signer.sign({a:1,b:2});
    var secondSigner = secureMe().signer({salt:"abcd"});
    expect(secondSigner.validate(secureobj)).to.be.ok;
    done();
  })
})
