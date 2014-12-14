(function() {

var Chess = require('./Chess');

//load in modules
require('./Board');
require('./ServerInterface');
require('./Rating');
require('./AI');

if(process.argv.length < 4) {
	console.log("Error: Too few arguments.");
	return;
}


Chess.init(process.argv[2], process.argv[3]);
console.log("Starting game...");

})();