(function() {
	/** 
	 * Piece naming conventions:
	 * Uppercase = Black
	 * Lowercase = White
	 * K - king, Q - queen, R - rook, B - bishop, N - knight, P - pawn
	 * i.e., n = white night, Q = black queen
	 */
	 
	var Board = function() {
		this.state = 
			"RNBQKBNR" +
			"PPPPPPPP" +
			"        " +
			"        " +
			"        " +
			"        " +
			"pppppppp" +
			"rnbqkbnr";
	}
	Board.prototype.getPieceAt = function(boardIndex) {
		return this.state.charAt(this.Helpers.boardCoordinatesToIndex(boardIndex));
	};

	Board.prototype.move = function(currentBoardIndex, newBoardIndex) {
		//TODO: Add support for promotion
		if(currentBoardIndex.length === 5) currentBoardIndex = currentBoardIndex.substr(1);
		if(currentBoardIndex.length === 4) {
			newBoardIndex = currentBoardIndex.slice(2,4);
			currentBoardIndex = currentBoardIndex.slice(0,2);
		}

		if(currentBoardIndex.length === 2 && newBoardIndex && newBoardIndex.length === 2 && this.getPieceAt(currentBoardIndex) !== " ") {
			this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex(newBoardIndex), this.getPieceAt(currentBoardIndex));
			this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex(currentBoardIndex), " ");
		} 
	};

	Board.prototype.eval = function(playerColor) {

	};

	Board.prototype.clone = function() {
		var b = new Board();
		b.state = this.state;
		return b;
	};
	
	Board.prototype.equals = function(board) {return this.state === board.state;};

	Board.prototype.generateNextStates = function() {
		var moves = [];
		var currentPiece = "";
		var currentLocation = "";
		for(var i=0; i<this.state.length; i++) {
			if(this.state.charAt(i) === " ") continue;

			var piece = this.state.charAt(i);	
			currentLocation = this.Helpers.indexToBoardCoordinates(i);
			currentPiece = piece.toUpperCase();

			if(piece === "p") {
				getDiagonalMoves.call(this, 10, i, piece === piece.toUpperCase() ? "B" : "W");
			} else if(piece === "P") {
			} else if(piece === "k" || piece === "K") {
			} else if(piece === "q" || piece === "Q") {

			} else if(piece === "n" || piece === "N") {

			} else if(piece === "r" || piece === "R") {

			} else if(piece === "b" || piece === "B") {

			}

			function getDiagonalMoves(distance, startPos, color) {
				var lastMod8 = startPos % 8;
				for(var i=1; i<=distance; i++) {
					var positionIndex = startPos - (i*8) - i;
					if(positionIndex % 8 > lastMod8) break;
					if(positionIndex < 0 || positionIndex > 63) break;

					var pieceAtPosition = this.state.charAt(positionIndex);

					if(pieceAtPosition === " ") {
						moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					} else {
						var pieceAtPositionColor = pieceAtPosition === pieceAtPosition.toUpperCase() ? "B" : "W";
						if(color === pieceAtPositionColor) break;
						else {
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}
			}

		}

		return moves;
	};

	Board.prototype.Helpers = {};

	Board.prototype.Helpers.indexToBoardCoordinates = function(index) {
		return ['a','b','c','d','e','f','g','h'][index%8] + (8 - Math.floor(index / 8));
	};

	Board.prototype.Helpers.boardCoordinatesToIndex = function(boardCoordinates) {
		var fileIndex = boardCoordinates.charCodeAt(0) - 97;
		var rankIndex = 8 - parseInt(boardCoordinates.charAt(1));
		return rankIndex*8 + fileIndex;
	};

	Chess.Board = Board;
})();