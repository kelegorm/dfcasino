var Emitter = require('events').EventEmitter;

var _ = require('underscore');
var request = require('request');

module.exports = function(opts){
  var observer = new Emitter();
  if(!opts.store){
    throw new Error('you need to define sessoion store');
  }
  if(!opts.baseUrl){
    throw new Error('you need to define sessoion baseUrl');
  }
  if(!opts.origin){
    throw new Error('you need to specify origin')
  }

  function sessionEventHandler(data, sessionStore, callback){
    if(!data || !data.eventName) return callback();
    var eventName = data.eventName;
    data.eventName = undefined;
    data.sessionStore = sessionStore;
    observer.emit(eventName, data);
    callback();
  }
  
  return {
    middleware: function(req, res, next){
      //check if url
      //handle
      if(req.url === opts.baseUrl){
        return sessionEventHandler(req.body, req.sessionStore, function(err){
          //TODO: error handling
          res.end();
        });
      }
      return boostReq();

      function boostReq(){
        req.session.emit = function(eventName, data){
          data = data ||{};
          if(!req.session.subscribers) return;
          // {sessID,host}
          _(req.session.subscribers).each(emitToSubscriber);
          //emit with sessionID
          function emitToSubscriber(subscriber){
            data.sessionID = subscriber.sessionID;
            data.eventName = eventName;
            doRequest(subscriber.origin + opts.baseUrl, data);
          }
        }

        req.session.getSubscription = function(){
          return {sessionID:req.sessionID, origin: opts.origin};
        }

        req.session.subscribe = function(obj){
          if(!req.session.subscribers) req.session.subscribers = [];
          req.session.subscribers.push(obj);
        }
        next();
      }
      function doRequest(url, data){
        request.post(url, {form:data, jar:false}, function(err, res, body){
          if(err){
            return console.log(err);
          }
        });
      }
    },
    on: function(evtName, handler){
      function wrapperHandler(data){
        var that = this;
        if(!data.sessionID) return console.log("no such session");
        data.sessionStore.get(data.sessionID, function(err, sess){
          handler.call(that, err, sess, data);
        });
      }
      observer.on(evtName, wrapperHandler);
    }
  }
}
