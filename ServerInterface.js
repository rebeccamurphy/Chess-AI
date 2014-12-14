(function() {

	var Chess = require('./Chess');
	var request = require('request');

	var ServerInterface = function() {
		this.initializationLink = "http://www.bencarle.com/chess/newgame";
		this.pollingLink = "http://www.bencarle.com/chess/poll"; //append   /GAMEID/TEAMNUMBER/TEAMSECRET/
		this.moveLink = "http://www.bencarle.com/chess/move";    //append   /GAMEID/TEAMNUMBER/TEAMSECRET/MOVESTRING/

		this.pollingInterval = null;
	};

	ServerInterface.prototype.poll = function() {
		var self = this;
		this.pollingInterval = setInterval(function() {
			console.log("Polling server...");
			request(self.pollingLink + "/" + Chess.gameId + "/" + Chess.teamNumber + "/" + Chess.teamSecret + "/", function(err, response, body) {
				if(!err) console.log("Retrieved response: " + body); else console.log("Error while polling..."); 
				var data = JSON.parse(body);
				Chess.isMyTurn = data.ready;
				Chess.secondsLeft = data.secondsLeft;
				Chess.lastMoveNumber = data.lastmovenumber;
				
				if(data.ready) {
					clearInterval(self.pollingInterval);
					self.pollingInterval = null;
					Chess.moveStack.unshift(data.lastmove);
					Chess.boardState.move(data.lastmove); //update game board with last move
					//this should get the ball rolling with the ai
					console.log("Calculating move...");
					var newMove = Chess.AI.alphaBeta(Chess.AI.limitDepth, Chess.AI.alpha, Chess.AI.beta, '', Chess.boardState, 0);
					self.sendMove(newMove);
				}
			});
		}, 5000);
	};

	ServerInterface.prototype.sendMove = function(moveString) {
		if(!Chess.isMyTurn) return;
		var self = this;
		Chess.isMyTurn = false;
		request(self.moveLink + "/" + Chess.gameId + "/" + Chess.teamNumber + "/" + Chess.teamSecret + "/" + moveString + "/", function(err, response, body) {
			if(!err) {
				var data = JSON.parse(body);
				Chess.boardState.move(moveString);
				console.log("Move request sent to server: " + moveString);
				console.log("Server response: " + body);
			} else {
				console.log("Error sending move...");
			}
			self.poll();
		});
	};

	Chess.ServerInterface = new ServerInterface();
})();