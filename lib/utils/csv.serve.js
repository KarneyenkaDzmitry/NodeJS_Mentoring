"use strict";

var _promises = require("fs/promises");

var _fs = require("fs");

var _path = require("path");

var _v = _interopRequireDefault(require("csvtojson/v2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var CSV_WORK_DIR = (0, _path.join)((0, _path.resolve)('.'), 'temp', 'csv');
var CSV_DEST_DIR = (0, _path.join)((0, _path.resolve)('.'), 'temp', 'csv-parsed');
console.debug(`Working Directory:\t[${CSV_WORK_DIR}]`);
console.debug(`Target Directory:\t[${CSV_DEST_DIR}]`);

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var list;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return validatePath(CSV_WORK_DIR);

          case 2:
            _context2.next = 4;
            return validatePath(CSV_DEST_DIR);

          case 4:
            _context2.next = 6;
            return getListCSVFiles(CSV_WORK_DIR);

          case 6:
            list = _context2.sent;
            list.forEach( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filename) {
                var filepathR, filepathD, readStream, writeStream, csv;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        filepathR = (0, _path.join)(CSV_WORK_DIR, filename);
                        filepathD = (0, _path.join)(CSV_DEST_DIR, (0, _path.basename)(filename) + '.txt');
                        readStream = (0, _fs.createReadStream)(filepathR);
                        writeStream = (0, _fs.createWriteStream)(filepathD);
                        csv = (0, _v.default)({
                          output: "json",
                          noheader: false
                        });
                        readStream.pipe(csv).pipe(writeStream); // csv.on('data', (data) => console.log(`Data Line: [${data}]`))

                        _context.next = 9;
                        return (0, _promises.rm)(filepathR);

                      case 9:
                        _context.next = 15;
                        break;

                      case 11:
                        _context.prev = 11;
                        _context.t0 = _context["catch"](0);
                        console.error('Oups...Something went wrong!');
                        console.error(_context.t0.message);

                      case 15:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 11]]);
              }));

              return function (_x3) {
                return _ref.apply(this, arguments);
              };
            }());

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _main.apply(this, arguments);
}

;

function getListCSVFiles(_x) {
  return _getListCSVFiles.apply(this, arguments);
}

function _getListCSVFiles() {
  _getListCSVFiles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(path) {
    var names;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _promises.readdir)(path);

          case 3:
            names = _context3.sent;
            names = names.filter(function (name) {
              return name.endsWith('csv');
            });
            return _context3.abrupt("return", names);

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            console.error(`ERROR: ${_context3.t0.message}`);
            return _context3.abrupt("return", []);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return _getListCSVFiles.apply(this, arguments);
}

function validatePath(_x2) {
  return _validatePath.apply(this, arguments);
}

function _validatePath() {
  _validatePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(path) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _promises.access)(path, _fs.constants.F_OK);

          case 3:
            console.info(`[${path}] is accessable.`);
            _context4.next = 12;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            console.info(`[${path}] is not accessable.`);
            _context4.next = 11;
            return (0, _promises.mkdir)(path);

          case 11:
            console.debug(`[${path}] has been just created.`);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 6]]);
  }));
  return _validatePath.apply(this, arguments);
}

;
main();