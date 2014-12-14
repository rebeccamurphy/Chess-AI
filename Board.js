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

	Board.prototype.eval = function() {};

	Board.prototype.clone = function() {
		var b = new Board();
		b.state = this.state;
		return b;
	};
	
	Board.prototype.equals = function(board) {return this.state === board.state;};

	Board.prototype.generateNextMoves = function(color) {
		var moves = [];
		var currentPiece = "";
		var currentLocation = "";
		for(var i=0; i<this.state.length; i++) {
			if(this.state.charAt(i) === " " || this.Helpers.getPieceColor(this.state.charAt(i)) !== color) continue;

			var piece = this.state.charAt(i);	
			currentLocation = this.Helpers.indexToBoardCoordinates(i);
			currentPiece = piece.toUpperCase();

			var diag = false;
			var straight = false;
			var dist = 0;

			if(piece === Chess.Pieces.White.PAWN) {
				//handle white pawn
				// getDiagonalMoves.call(this, 10, i);
			} else if(piece === Chess.Pieces.Black.PAWN) {
				//handle black pawn
			} else if(piece === Chess.Pieces[color].KING) {
				diag = true;
				straight = true;
				dist = 1;
			} else if(piece === Chess.Pieces[color].QUEEN) {
				diag = true;
				straight = true;
				dist = 8;
			} else if(piece === Chess.Pieces[color].KNIGHT) {
				// handle knight moves
			} else if(piece === Chess.Pieces[color].ROOK) {
				straight = true;
				dist = 8;
			} else if(piece === Chess.Pieces[color].BISHOP) {
				diag = true;
				dist = 8;
			}

			if(diag) getDiagonalMoves.call(this, dist, i);
			if(straight) getStraightMoves.call(this, dist, i);
		}

		function getDiagonalMoves(distance, startPos) {
				var lastMod8 = startPos % 8;
				
				//UP LEFT
				for(var i=1; i<=distance; i++) {
					var positionIndex = startPos - (i*8) - i;
					if(positionIndex % 8 >= lastMod8) break;
					if(positionIndex < 0 || positionIndex > 63) break;

					var pieceAtPosition = this.state.charAt(positionIndex);

					if(pieceAtPosition === " ") {
						moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					} else {
						if(color === this.Helpers.getPieceColor(pieceAtPosition)) break;
						else {
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}

				//UP RIGHT
				lastMod8 = startPos % 8;
				for(var i=1; i<=distance; i++) {
					var positionIndex = startPos - (i*8) + i;
					if(positionIndex % 8 <= lastMod8) break;
					if(positionIndex < 0 || positionIndex > 63) break;

					var pieceAtPosition = this.state.charAt(positionIndex);

					if(pieceAtPosition === " ") {
						moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					} else {
						if(color === this.Helpers.getPieceColor(pieceAtPosition)) break;
						else {
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}

				//DOWN RIGHT
				lastMod8 = startPos % 8;
				for(var i=1; i<=distance; i++) {
					var positionIndex = startPos + (i*8) + i;
					if(positionIndex % 8 <= lastMod8) break;
					if(positionIndex < 0 || positionIndex > 63) break;

					var pieceAtPosition = this.state.charAt(positionIndex);

					if(pieceAtPosition === " ") {
						moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					} else {
						if(color === this.Helpers.getPieceColor(pieceAtPosition)) break;
						else {
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}

				//DOWN LEFT
				lastMod8 = startPos % 8;
				for(var i=1; i<=distance; i++) {
					var positionIndex = startPos + (i*8) - i;
					if(positionIndex % 8 >= lastMod8) break;
					if(positionIndex < 0 || positionIndex > 63) break;

					var pieceAtPosition = this.state.charAt(positionIndex);

					if(pieceAtPosition === " ") {
						moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					} else {
						if(color === this.Helpers.getPieceColor(pieceAtPosition)) break;
						else {
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}
			}

			function getStraightMoves(distance, startPos) {
				//up, down, left, right
				//dir[0] = up/down, dir[1] = left/right
				for(dir of [[-1,0],[1,0],[0,-1],[0,1]]) {
					for(var i=1; i<=distance; i++) {
						var positionIndex = startPos + (dir[0]*i*8) + (dir[1]*i);
						if(dir[0] === 0 && Math.floor(startPos / 8) !== Math.floor(positionIndex / 8)) break;
						if(positionIndex < 0 || positionIndex > 63) break;

						var pieceAtPosition = this.state.charAt(positionIndex);

						if(pieceAtPosition === " ") {
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
						} else {
							if(color === this.Helpers.getPieceColor(pieceAtPosition)) break;
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

	Board.prototype.Helpers.getPieceColor = function(piece) {
		if(piece !== " ") return piece.toUpperCase() === piece ? Chess.Colors.BLACK : Chess.Colors.WHITE;
	}

	Chess.Board = Board;
})();