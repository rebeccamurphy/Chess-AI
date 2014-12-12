(function() {
	var ServerInterface = function() {
		this.initializationLink = "http://www.bencarle.com/chess/newgame";
		this.pollingLink = "http://www.bencarle.com/chess/poll"; //append   /GAMEID/TEAMNUMBER/TEAMSECRET/
		this.moveLink = "http://www.bencarle.com/chess/move";    //append   /GAMEID/TEAMNUMBER/TEAMSECRET/MOVESTRING/

		this.pollingInterval = null;
	};

	ServerInterface.prototype.init = function() {};
	ServerInterface.prototype.poll = function() {};
	ServerInterface.prototype.sendMove = function(moveString) {};

	Chess.ServerInterface = new ServerInterface();
})();