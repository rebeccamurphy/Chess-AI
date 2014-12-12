(function() {
	/** 
	 * Piece naming conventions:
	 * Uppercase = Black
	 * Lowercase = White
	 * K - king, Q - queen, R - rook, B - bishop, N - knight, P - pawn
	 * i.e., n = white night, Q = black queen
	 */
	 
	var Board = function() {
		this.state = new Array(64);
	}

	Board.prototype.getPieceAt = function(boardIndex) {};
	Board.prototype.move = function(currentBoardIndex, newBoardIndex) {};
	Board.prototype.eval = function() {};
	Board.prototype.clone = function() {};
	Board.prototype.equals = function(board) {};
	Board.prototype.isEndState = function() {};
	Board.prototype.generateNextStates = function(returnMoveString) {};
	Board.prototype.init = function() {};

	Chess.Board = Board;
})();