const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var fileName = `/${id}.txt`;
    var filePath = exports.dataDir + fileName;
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw('error writing unique text file');
      } else {
        callback(null, {id, text});
      }
    })
  });
};

exports.readAll = (callback) => {
  var output = [];
  var counter = 0;
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw('error in reading directory');
    }
    if (files.length === 0) {
      if (err) {
        throw('error in reading file');
      } else {
        callback(null, output);
      }
    } else {
      for (let file of files) {
        let filePath = exports.dataDir + `/${file}`;
        fs.readFile(filePath, (err, data) => {
          if (err) {
            throw('error in reading file');
          } else {
            var body = '';
            body += data;
            var id = filePath.slice(-9, -4);
            output.push({id: id, text: id});
            //Somehow fix the text:id thing eventually
            counter++;
            if (counter === files.length) {
              callback(null, output);
            }
          }
        })
      };
    }
  })
};

  exports.readOne = (id, callback) => {
    var filePath = exports.dataDir + `/${id}.txt`;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        callback(err);
        // console.error(err);
        // throw('error in finding single file');
      } else {
        var body = '';
        body += data;
        callback(null, {id: id, text: body});
      }
    });
  };

exports.update = (id, text, callback) => {
  var filePath = exports.dataDir + `/${id}.txt`;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err);
      console.error(err);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw('error in updating file');
        } else {
          callback(null, {id: id, text: text});
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  var filePath = exports.dataDir + `/${id}.txt`;
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
      console.error('error in finding file to delete');
    } else {
      callback();
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
