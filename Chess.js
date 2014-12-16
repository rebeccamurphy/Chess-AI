module.exports = (function() {

	var Chess = {
		isMyTurn: false,
		color: "",
		opponentColor: "",
		moveStack: [],
		lastMoveNumber: -1,
		secondsLeft: -1,
		boardState: null,
		ratingSystem:null,
		gameId: -1,
		teamNumber: 205,
		teamSecret: "fa62a752",
		debug: {
			teamNumber: 2,
			teamSecret: "1a77594c"
		},
		err: 0,
		init: function(gId, color, debug) {
			this.gameId = gId;
			this.color = color;
			this.opponentColor = this.Helpers.flipColor(this.color);

			if(debug) {
				this.teamNumber = this.debug.teamNumber;
				this.teamSecret = this.debug.teamSecret;
			}

			this.boardState = new this.Board();
			this.ratingSystem = new this.Rating();
			this.ServerInterface.poll();
			console.log(Chess.boardState.toString());
		}
	};

	//setting up a few constants
	Chess.Colors = {
		BLACK  : "Black",
		WHITE  : "White"
	}

	Chess.Pieces = {
		Black : {
			BISHOP : "B",
			KNIGHT : "N",
			PAWN   : "P",
			KING   : "K",
			QUEEN  : "Q",
			ROOK   : "R"
		},
		White : {
			BISHOP : "b",
			KNIGHT : "n",
			PAWN   : "p",
			KING   : "k",
			QUEEN  : "q",
			ROOK   : "r"
		}
	}

	//and a few helper functions
	Chess.Helpers = {
		flipColor : function(color) {return color === Chess.Colors.BLACK ? Chess.Colors.WHITE : Chess.Colors.BLACK;}
	}

	//adding additional functionality to classes
	String.prototype.replaceAt = function(index, ch) {
		return this.substr(0,index) + ch + this.substr(index+ch.length);
	}

	//return Chess object
	return Chess;
})();
