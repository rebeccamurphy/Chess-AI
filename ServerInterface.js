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
				var data;
				try {
					data = JSON.parse(body);
				} catch(e) { return; }
				
				Chess.isMyTurn = data.ready;
				Chess.secondsLeft = data.secondsLeft;
				Chess.lastMoveNumber = data.lastmovenumber;
				
				if(data.gameover) {
					clearInterval(self.pollingInterval);
					self.pollingInterval = null;
					console.log("Game over. Winner: " + data.winner);
					console.log(Chess.boardState.toString());
					return;
				}

				if(data.ready) {
					clearInterval(self.pollingInterval);
					self.pollingInterval = null;
					if(data.lastmove !== "") {
						Chess.moveStack.unshift(data.lastmove);
						Chess.boardState.move(data.lastmove); //update game board with last move
						console.log(Chess.boardState.toString());
					}
					//this should get the ball rolling with the ai
					console.log("Calculating move...");
					var newMove = Chess.AI.alphaBeta(Chess.AI.limitDepth, Chess.AI.alpha, Chess.AI.beta, '', Chess.boardState, 0)[0];
					//add move caching
					if (Chess.moveCache.indexOf(newMove.toUpperCase())!==-1 &&!Chess.boardState.isKingInCheck(Chess.color)){
						//caught in loop, need to remove move from possibilities
						newMove = Chess.AI.alphaBeta(Chess.AI.limitDepth, Chess.AI.alpha, Chess.AI.beta, '', Chess.boardState, 0, newMove.toUpperCase())[0];
					}
					if (Chess.moveCache.length>=Chess.cacheLimit){
						//remove oldest move
						Chess.moveCache.pop();
						//add new move
						Chess.moveCache.push(newMove.toUpperCase());
					}
					self.sendMove(newMove);
				}
			});
		}, 5000);
	};

	ServerInterface.prototype.sendMove = function(moveString) {
		if(!Chess.isMyTurn) return;
		var self = this;
		request(self.moveLink + "/" + Chess.gameId + "/" + Chess.teamNumber + "/" + Chess.teamSecret + "/" + moveString + "/", function(err, response, body) {
			if(!err) {
				var data;
				console.log("Move request sent to server: " + moveString);
				console.log("Server response: " + body);
				
				try {
					data = JSON.parse(body);
				} catch(e) {
					Chess.isMyTurn = false;
					self.poll();
					return;
				}
				
				if(data.result) {
					Chess.isMyTurn = false;
					Chess.boardState.move(moveString);
					Chess.err = 0;
					console.log(Chess.boardState.toString());
					self.poll();
				} else {
					console.log("Attempted invalid move. Err: " + (++Chess.err));
					if(Chess.err >= 2) {
						var posMoves = Chess.boardState.generateNextMoves(Chess.color);
						var rMove = posMoves[Math.floor(Math.random() * (posMoves.length - 1))];
						console.log("Unstuckifier says: \"Attempting random move: " + rMove + "\"");
						self.sendMove(rMove);
					} else self.sendMove(moveString);
				}

			} else {
				console.log("Error sending move...");
				self.poll();
			}
		});
	};

	Chess.ServerInterface = new ServerInterface();
})();