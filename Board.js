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
		if (typeof boardIndex === "number")
			return this.state.charAt(boardIndex);
		else
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

	Board.prototype.eval = function(moveListLength, depth) {
		return Chess.ratingSystem.getRating(this, moveListLength, depth);
	};

	Board.prototype.clone = function() {
		var b = new Board();
		b.state = this.state;
		return b;
	};
	
	Board.prototype.equals = function(board) {return this.state === board.state;};

	Board.prototype.generateNextMoves = function(color) {
		//TODO: Special moves (ie castle)
		//TODO: No illegal moves (putting your own king in check)
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
			var pawnDirection = 0;

			if(piece === Chess.Pieces.White.PAWN) {
				pawnDirection = -1;
			} else if(piece === Chess.Pieces.Black.PAWN) {
				pawnDirection = 1;
			} else if(piece === Chess.Pieces[color].KING) {
				diag = true;
				straight = true;
				dist = 1;
			} else if(piece === Chess.Pieces[color].QUEEN) {
				diag = true;
				straight = true;
				dist = 8;
			} else if(piece === Chess.Pieces[color].KNIGHT) {
				for(positionOffset of [[-2,-1],[-2,1],[-1,-2],[-1,2],[2,-1],[2,1],[1,-2],[1,2]]) {
					var positionIndex = i + (positionOffset[0] * 8) + positionOffset[1];
					if(positionIndex <= 63 && positionIndex >= 0 && Math.floor((i + (positionOffset[0] * 8)) / 8) === Math.floor(positionIndex / 8)) {
						var pieceAtPosition = this.state.charAt(positionIndex);

						if(pieceAtPosition === " " || this.Helpers.getPieceColor(pieceAtPosition) !== color)
							moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					}
				}
			} else if(piece === Chess.Pieces[color].ROOK) {
				straight = true;
				dist = 8;
			} else if(piece === Chess.Pieces[color].BISHOP) {
				diag = true;
				dist = 8;
			}

			if(diag) getDiagonalMoves.call(this, dist, i);
			if(straight) getStraightMoves.call(this, dist, i);

			//if we are dealing with a pawn
			if(pawnDirection !== 0) {
				var pawnForward1 = i + pawnDirection * 8;
				var pawnForward2 = i + pawnDirection * 16;
				var pawnForwardLeft = i + pawnDirection * 8 - 1;
				var pawnForwardRight = i + pawnDirection * 8 + 1;
				var pawnInHomePosition = color === Chess.Colors.BLACK ? i >= 8 && i <= 15 : i >= 48 && i <= 55;

				if(pawnForward1 >= 0 && pawnForward1 <= 63 && this.getPieceAt(pawnForward1) === " ") 
					moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForward1));

				if(pawnInHomePosition && pawnForward2 >= 0 && pawnForward2 <= 63 && this.getPieceAt(pawnForward2) === " " && this.getPieceAt(pawnForward1) === " ") 
					moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForward2));

				if(pawnForwardLeft >= 0 && pawnForwardLeft <= 63 &&
					this.getPieceAt(pawnForwardLeft) !== " " && this.Helpers.getPieceColor(this.getPieceAt(pawnForwardLeft)) !== color && 
					Math.floor((i + pawnDirection * 8) / 8) === Math.floor(pawnForwardLeft / 8))
					moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForwardLeft));

				if(pawnForwardRight >= 0 && pawnForwardRight <= 63 &&
					this.getPieceAt(pawnForwardRight) !== " " && this.Helpers.getPieceColor(this.getPieceAt(pawnForwardRight)) !== color && 
					Math.floor((i + pawnDirection * 8) / 8) === Math.floor(pawnForwardRight / 8))
					moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForwardRight));
			}
		}

		function getDiagonalMoves(distance, startPos) {
			//up left, up right, down left, down right
			//dir[0] = up/down, dir[1] = left/right
			for(dir of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
				var lastMod8 = startPos % 8;
				for(var i=1; i<=distance; i++) {
					var positionIndex = startPos + (dir[0]*i*8) + (dir[1]*i);
					if(dir[1] < 0 && positionIndex % 8 >= lastMod8) break;
					if(dir[1] > 0 && positionIndex % 8 <= lastMod8) break;
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

	Board.prototype.toString = function() {
		var str = "\n";
		for(var i=0; i<this.state.length; i+=8) 
			str += (8-(i/8)) + " " + this.state.slice(i,i+8) + '\n';

		str += "\n  ";
		for(var file of ['a','b','c','d','e','f','g','h'])
			str += file;

		str += '\n';

		return str.split("").join(" ");
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