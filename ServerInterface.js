(function() {
	var ServerInterface = function() {
		this.initializationLink = "http://www.bencarle.com/chess/newgame";
		this.pollingLink = "http://www.bencarle.com/chess/poll"; //append   /GAMEID/TEAMNUMBER/TEAMSECRET/
		this.moveLink = "http://www.bencarle.com/chess/move";    //append   /GAMEID/TEAMNUMBER/TEAMSECRET/MOVESTRING/

		this.pollingInterval = null;
	};

	ServerInterface.prototype.poll = function() {
		var self = this;

		this.pollingInterval = setInterval(function() {
			$.ajax({
				url: self.pollingLink + "/" + Chess.gameId + "/" + Chess.teamNumber + "/" + Chess.teamSecret + "/",
				success: function(data) {
					Chess.isMyTurn = data.ready;
					Chess.secondsLeft = data.secondsLeft;
					Chess.lastMoveNumber = data.lastmovenumber;
					
					if(data.ready) {
						clearInterval(self.pollingInterval);
						self.pollingInterval = null;
						Chess.moveStack.unshift(data.lastmove);
						Chess.Board.move(data.lastmove.slice(1,3), data.lastmove.slice(3,5)); //update game board with last move
						//this should get the ball rolling with the ai
						var newMove = Chess.AI.alphaBeta(Chess.AI.limitDepth, Chess.AI.alpha, Chess.AI.beta, '', Chess.Board, 0)[0];
						this.sendMove(newMove);
					}
				}
			});
		}, 5000);
	};

	ServerInterface.prototype.sendMove = function(moveString) {
		var self = this;
		Chess.isMyTurn = false;
		$.ajax({
			url: self.moveLink + "/" + Chess.gameId + "/" + Chess.teamNumber + "/" + Chess.teamSecret + "/" + moveString + "/",
			success: function() {self.poll();}
		});
	};

	Chess.ServerInterface = new ServerInterface();
})();