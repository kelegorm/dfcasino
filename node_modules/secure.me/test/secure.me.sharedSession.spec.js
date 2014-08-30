var secureMe = require("../secure.me.js");
var express = require("express");
var expect = require("chai").expect;
var util = require("util");
var request = require("request");
var _ = require("underscore");
describe("secure me #integration #sharedSession", function(){
  var sharedSession1,sharedSession2;
  before(function(done){
    var app1 = express();
    var app2 = express();
    var sessStore1 = new express.session.MemoryStore;
    var sessStore2 = new express.session.MemoryStore;
    app1.use(express.bodyParser());
    app1.use(express.cookieParser());
    app1.use(express.session({secret:"1", store: sessStore1}));
    app2.use(express.bodyParser());
    app2.use(express.cookieParser());
    app2.use(express.session({secret:"2", store: sessStore2}));
    
    sharedSession1 = secureMe().sharedSession({
      origin:"http://localhost:2346",
      baseUrl:"/_session/events",
      store: sessStore1
    });

    var sessionEventsMiddleware1 = sharedSession1.middleware;
    
    sharedSession1.on('subscribe', function(err, sess, data){
        if(!sess.subscribers) sess.subscribers = [];
        sess.subscribers.push(data.subscribefor);
        data.sessionStore.set(data.sessionID, sess);
    });

    sharedSession2 = secureMe().sharedSession({
      origin:"http://localhost:2347",
      baseUrl:"/_session/events",
      store: sessStore2
    });
    var sessionEventsMiddleware2 = sharedSession2.middleware;



    
    app1.use(sessionEventsMiddleware1);
    app2.use(sessionEventsMiddleware2);
    
    app1.get('/getSubscription',function(req,res,next){
      _(req.session).extend(req.query);
      res.json(req.session.getSubscription());
    })
    app1.get('/logout',function(req,res,next){
      //TODO:need to preserve session
      _(req.session).extend(req.query);
      req.session.emit('logout');
      res.json(req.session.getSubscription());
    })
    
    app2.post('/subscribe',function(req,res,next){
      _(req.session).extend(req.query);
      req.session.subscribe(req.body);
      req.session.f=15;
      req.session.emit('heelYeah',{someStuff:10});
      req.session.emit('subscribe', {subscribefor: req.session.getSubscription()});
      res.json(req.session);
    })
   
    app1.listen(2346);
    app2.listen(2347)
    done();
  });

  describe("some stuff", function(){
    it("some", function(done){
      var j = request.jar();
      request.get('http://localhost:2346/getSubscription?d=10',{jar:j}, function(err, res, body){
        request.post('http://localhost:2347/subscribe', {form:JSON.parse(body),jar:false} , function(){});
      })

      sharedSession1.on('heelYeah', function(err, sess, data){
        request.get('http://localhost:2346/logout',{jar:j}, function(err, res, body){
        })
      })

      sharedSession2.on('logout', function(err, sess, data){
        expect(sess).to.have.property('f', 15);
        done();
      });
    })
  })
})
 
