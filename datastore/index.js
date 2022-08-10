const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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
  var convertToData = (file) => {
    let url = exports.dataDir + `/${file}`;
    return fsPromises.readFile(url, 'utf8')
    .then((data) => {return {id: file.slice(0,5), text: data}})
  }

  return fsPromises.readdir(exports.dataDir)
  .then((files) => {
    return Promise.all(files.map(convertToData))
    .then((output) => {
      return output;
    })
  });
};

  exports.readOne = (id, callback) => {
    var filePath = exports.dataDir + `/${id}.txt`;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        callback(err);
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
