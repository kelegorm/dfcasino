var _ = require("underscore");
var signer = require("./signer.js");
var sharedSession = require("./sharedSession.js");

var secureMe = function(opts){ 
  var securityMiddlewares = [];
  var defaultMiddleware = null;

  return {
    // security middleware setter
    setMiddlewares : function(middlewares){
      _(middlewares).each(function(middleware){
        middleware._secureme = true;
      });
      securityMiddlewares = middlewares;
    },
    setDefault: function(middleware){
      defaultMiddleware = middleware;
      defaultMiddleware._secureme = true;
    },
    // will make all routes secure besides those that have "guest middleware"
    secureRoutes : function(app){
      _.each(app.routes, eachRouteType);
      appWrapper(app);
      return app;
      
      function eachRouteType(routeType){
        _.each(routeType, eachRoute);
      }
      
      function eachRoute(route){
        if(!isSecureMe(route)){
          route.callbacks.unshift(defaultMiddleware);
        }
        return route;
      }
    },
    signer: signer,
    sharedSession: sharedSession
  }



  function isSecureMe(route){
    var securityMiddle = _.find(route.callbacks, findSecurityMiddle);
    return !!securityMiddle;
  }


  function appWrapper(app){
    // check full list of methods
    app.get = routeSetter(app.get);
    app.put = routeSetter(app.put);
    app.post = routeSetter(app.post);
    app.del = routeSetter(app.del);
    app.all = routeSetter(app.all);

    function routeSetter(method){
      return function(){
        var args = Array.prototype.slice.call(arguments);
        if(_.isFunction(args[args.length - 1])){
          var securityMiddlewarePassed = _.find(args, findSecurityMiddle);
          !securityMiddlewarePassed && args.splice(1, 0, defaultMiddleware); 
        }
        return method.apply(app, args);
      }
    }
  }

  function findSecurityMiddle(callback){
    return callback._secureme === true;
  }

}

module.exports = secureMe;
