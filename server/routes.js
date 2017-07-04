var ObjectId = require('mongodb').ObjectId;
var User = require('./models/user');

var mongoose = require('mongoose');
var fs = require('fs');
var Grid = require('gridfs-stream');
var path = require('path');

module.exports = function(app, passport) {

  var conn = mongoose.connection;
  Grid.mongo = mongoose.mongo;
  var gfs;

  conn.once("open", () => {
    gfs = Grid(conn.db);
  });

  //create a cors middleware
  app.use(function(req, res, next) {
  //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post('/login', passport.authenticate('local-login'), function(req, res) {
    res.json(req.user);
  });

  app.post('/register', passport.authenticate('local-register'), function(req, res) {
    res.json(req.user);
  });

  app.get('/users/:user', function(req, res) {
    var userId = req.params.user;
    console.log(userId);
  
    var objId = new ObjectId(userId);

    User.findOne({_id: objId} , function(err, result) {
      if(err) {
        return done(err);
      }
      console.log(result);
      res.json(result.local.name);
  });
  });

  app.get('/upload/:user', (req, res) => {
    var user = req.params.user;
    if(!gfs) {
      return responseStatus(res, 400, 'Something went wrong in the databse', null);
    }
    var objId = new ObjectId(user);
    var admin;

    User.findOne({_id: objId} , function(err, result) {
      if(err) {
        return done(err);
      }
      if(result) {
        admin = result.local.email;
      }

      //For Admin
      if(admin == 'admin@filemanager.com') {
        gfs.files.find({}).toArray((err, files) => {
          if (files.length === 0) {
            return responseStatus(res, 400, 'File not found', null);
          }
          return responseStatus(res, 200, 'Success', files);
        });
      } else {
        gfs.files.find({
        'metadata.userId': user
        }).toArray((err, files) => {

          if (files.length === 0) {
            return responseStatus(res, 400, 'File not found', null);
          }
          return responseStatus(res, 200, 'Success', files);
        });
      }
    });
  });

  app.get('/upload/:user/:fileId', function(req, res){
    if(!gfs) {
      return responseStatus(res, 400, 'Something went wrong in the databse', null);
    }
    var id = req.params.fileId;
    var objId = new ObjectId(id);
    var user = req.params.user;
    /** First check if file exists */
    gfs.files.find({$and:[{'metadata.userId': user},{_id : objId}]})
    .toArray(function(err, files){
      if(!files || files.length === 0){
        return responseStatus(res, 400, 'File not found', null);
      }
      /** create read stream */
      var readstream = gfs.createReadStream({
        _id: id
      });
      /** set the proper content type */
      res.set('Content-Type', files[0].contentType);
      res.set('File-Name', files[0].filename);

      /** return response */
      return readstream.pipe(res);
    });
  });

  app.post('/upload/:user', function(req, res) {
    if(!gfs) {
      return responseStatus(res, 400, 'Something went wrong in the databse,', null);
    }
    var userId = req.params.user;
    var objId = new ObjectId(userId);
    var username;

    User.findOne({_id: objId} , function(err, result) {
      if(err) {
        return done(err);
      }
      if(result) {
        username = result.local.name;
      }
      console.log(username);
      var part = req.files.file;
      if(!part.data && part.truncated) {
        return responseStatus(res, 400, 'File size limit (5MB) exceeded!!', null);
      }

      var writestream = gfs.createWriteStream({
        filename: part.name,
        mode: 'w',
        content_type: part.mimetype,
        metadata : {
          userId: userId,
          username: username
        }
      });

      writestream.on('close', (file) => {
        return res.status(200).send({
          message: 'File uploaded successfully!!',
          file: file
        });
      });

      writestream.write(part.data);
      writestream.end();
    });

  });

  app.delete('/upload/:fileId', function(req, res) {
    if(!gfs) {
      return responseStatus(res, 400, 'Something went wrong in the databse', null);
    }
    var id = req.params.fileId;
    var objId = new ObjectId(id);

    gfs.files.find({
      _id : objId
    }).toArray((err, files) => {
      if (files.length === 0) {
        return responseStatus(res, 400, 'File not found', null);
      }
      gfs.remove({ _id: objId }, function (err) {
        if (err) return handleError(err);
          return responseStatus(res, 200, 'File Deleted!!', null);
      });
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.send("success");
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  function responseStatus(res, status, message, files) {
    if(files) {
      return res.status(status).send({
        message: message,
        files: files
      });
    }
    return res.status(status).send({
      message: message
    });
  }

};

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next;
  }
  res.redirect('/');
}
