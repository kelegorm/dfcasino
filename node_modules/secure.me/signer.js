var _ = require('underscore');
var crypto = require('crypto');
/*
* options:
* salt - should be same on both services
* timeToLive - time that token is valid
* cryptBy - crypt algorythm
*/
module.exports = function(options){
  if(!options.salt){
    throw new Error('You can"t use tokenizer without salt');
  }
  options = _({
    timeToLive: 30000,
    cryptBy: 'sha512'
  }).extend(options);
  
  function tokenize(string, timestamp, timeToLive){
    var token = crypto.createHash(options.cryptBy);
    token.update(string);
    token.update(options.salt);
    token.update(timestamp);
    if(timeToLive){
      token.update(""+timeToLive);
    }
    token = token.digest('hex');
    token += '.' + timestamp;
    if(timeToLive){
      token += '.' + timeToLive;
    }
    return token;
  }

  function generateToken(string, timeToLive){
    if(!string){
      return false;
    }
    var timestamp =''+ +new Date();
    if(timeToLive !== false && !timeToLive){
      timeToLive = options.timeToLive;
    }
    return tokenize(string, timestamp, timeToLive);
  }

  function validateToken(string, token){
    var tokenParts = token.split('.');
    if(tokenParts.length > 1){
      var tokenToCompare = tokenize(string, tokenParts[1], tokenParts[2]);
      if(tokenParts[2] && tokenToCompare === token){
        return (+tokenParts[1]+ +tokenParts[2] > +new Date()) && +tokenParts[1] < +new Date() + 1;
      }else{
        return tokenToCompare === token;
      }
    }
    return false;
  }

  function sign(object, timeToLive){
    if(!_(object).isObject()){
      return false;
    }
    if(object.__secureme) delete object.__secureme;
    var objectString = JSON.stringify(object);
    object.__secureme = generateToken(objectString, timeToLive);
    return object;
  }

  function validate(object){
    if(!_(object).isObject() || !object.__secureme){
      return false;
    }
    var tokenToValidate = object.__secureme;
    if(object.__secureme) delete object.__secureme;
    return validateToken(JSON.stringify(object), tokenToValidate);
  }
  // usage
  return {
    tokenize: generateToken,
    validateToken: validateToken,
    sign: sign,
    validate: validate
  }
}


