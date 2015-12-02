var mockery = require('mockery');
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
// Instantiate a Mocha instance.
if(process.env.NODE_ENV === 'unit_test') { //unit testing of this module requires specific modification to test
    var Mocha = require('mocha')
    var mocha = new Mocha();
    mockery.resetCache()
    mocha.addFile('./util/controlTestRunner.js');
    module.exports = function(overlay, inherited_dict, implemented_dict, callback) {
        mocha.addFile('./util/controlTestRunner.js');
        //overlay = overlayParameter;
        module.exports.overlay = overlay
        module.exports.inherited_dict = inherited_dict;
        module.exports.implemented_dict = implemented_dict;
        defaultConsolelog = console.log
        console.log = function() {}
        //defining mocha behavior
        //http://stackoverflow.com/questions/29050720/run-mocha-programatically-and-pass-results-to-variable-or-function
        var resultCount = {
            pending: 0,
            passing: 0,
            failing: 0
        }
        // Run the tests.
        mocha.run(function(failures) {
            console.log = defaultConsolelog;
            callback(resultCount);
        }).on('pass', function(test) {
            resultCount.passing++
        }).on('fail', function(test, err) {
            resultCount.failing++
        }).on('pending', function() {
            resultCount.pending++
        });;
    }
} else {
    module.exports = function(overlay, inherited_dict, implemented_dict, callback) {
        module.exports.overlay = overlay
        module.exports.inherited_dict = inherited_dict;
        module.exports.implemented_dict = implemented_dict;
        // Run the tests.
        mocha.run(function(failures) {
            callback(failures);
        });
    }
}
// module.exports = function(overlay, inherited_dict, implemented_dict, callback) {
//     module.exports.overlay = overlay
//     module.exports.inherited_dict = inherited_dict;
//     module.exports.implemented_dict = implemented_dict;
//     var spawn = require('child_process').spawn,
//     ls    = spawn('mocha', ['./util/controlTestRunner.js','--reporter','json','-u','tdd']);
//     ls.stdout.on('data', function (data) {
//       console.log('stdout: ' + data);
//     });
//     ls.stderr.on('data', function (data) {
//       console.log('stderr: ' + data);
//     });
//     ls.on('close', function (code) {
//       console.log('child process exited with code ' + code);
//     });
// }