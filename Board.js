(function() {
	
	var Chess = require('./Chess');

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

		this.allowableSpecialMoves = 0; //xxxx (en passant) 0000 (castle a8rook, h8rook, a1rook, h1rook)
	}
	Board.prototype.getPieceAt = function(boardIndex) {
		if (typeof boardIndex === "number")
			return this.state.charAt(boardIndex);
		else
			return this.state.charAt(this.Helpers.boardCoordinatesToIndex(boardIndex));
	};

	Board.prototype.move = function(move) {
		//TODO: add more move verification
		var currentBoardIndex, newBoardIndex, piece;

		if(move.length === 5 || (move.length === 6 && move.charAt(0).toUpperCase() === "P")) {
			currentBoardIndex = move.substr(1).slice(0,2);
			newBoardIndex = move.substr(1).slice(2,4);
			piece = this.getPieceAt(currentBoardIndex);
		} else return;

		if(move.charAt(0).toUpperCase() !== piece.toUpperCase()) return;

		if(move.length === 6) 
			piece = this.Helpers.getPieceColor(piece) === Chess.Colors.BLACK ? move.substr(5).toUpperCase() : move.substr(5).toLowerCase();

		//handle castling
		if(move.length === 5 && piece.toUpperCase() === "K" && Math.abs(move.charCodeAt(1) - move.charCodeAt(3)) > 1) {
			if(this.Helpers.getPieceColor(piece) === Chess.Colors.WHITE) {
				if(move.substring(1) === "e1g1" && this.getPieceAt("f1") === " " && this.getPieceAt("g1") === " " && this.getPieceAt("h1") === Chess.Pieces.White.ROOK) {
					this.allowableSpecialMoves = this.allowableSpecialMoves | 3;
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("e1"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("h1"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("g1"), Chess.Pieces.White.KING);
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("f1"), Chess.Pieces.White.ROOK);
				} else if(move.substring(1) === "e1c1" && this.getPieceAt("d1") === " " && this.getPieceAt("c1") === " " && this.getPieceAt("b1") === " " && this.getPieceAt("a1") === Chess.Pieces.White.ROOK) {
					this.allowableSpecialMoves = this.allowableSpecialMoves | 3;
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("e1"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("a1"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("c1"), Chess.Pieces.White.KING);
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("d1"), Chess.Pieces.White.ROOK);
				}
			} else {
				if(move.substring(1) === "e8g8" && this.getPieceAt("f8") === " " && this.getPieceAt("g8") === " " && this.getPieceAt("h8") === Chess.Pieces.Black.ROOK) {
					this.allowableSpecialMoves = this.allowableSpecialMoves | 12;
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("h8"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("e8"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("g8"), Chess.Pieces.Black.KING);
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("f8"), Chess.Pieces.Black.ROOK);
				} else if(move.substring(1) === "e8c8" && this.getPieceAt("d8") === " " && this.getPieceAt("c8") === " " && this.getPieceAt("b8") === " " && this.getPieceAt("a8") === Chess.Pieces.Black.ROOK) {
					this.allowableSpecialMoves = this.allowableSpecialMoves | 12;
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("e8"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("a8"), " ");
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("c8"), Chess.Pieces.Black.KING);
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex("d8"), Chess.Pieces.Black.ROOK);
				}
			}

			return;
		}

		//en passant
		if(move.length === 5 && piece.toUpperCase() === "P" && Math.abs(move.charCodeAt(1) - move.charCodeAt(3)) === 1 && this.getPieceAt(move.substr(3)) === " ") {
			if(this.Helpers.getPieceColor(piece) === Chess.Colors.WHITE) {
				if(this.getPieceAt(this.Helpers.boardCoordinatesToIndex(move.substr(3)) + 8) === Chess.Pieces.Black.PAWN)
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex(move.substr(3)) + 8, " ");
			} else {
				if(this.getPieceAt(this.Helpers.boardCoordinatesToIndex(move.substr(3)) - 8) === Chess.Pieces.White.PAWN)
					this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex(move.substr(3)) - 8, " ");
			}					
		}
		
		if(piece.toUpperCase() === "R") {
			switch(move.slice(1,3)) {
				case "a1": if(this.Helpers.getPieceColor(piece) === Chess.Colors.WHITE) this.allowableSpecialMoves |= 2; break;
				case "h1": if(this.Helpers.getPieceColor(piece) === Chess.Colors.WHITE) this.allowableSpecialMoves |= 1; break;
				case "a8": if(this.Helpers.getPieceColor(piece) === Chess.Colors.BLACK) this.allowableSpecialMoves |= 8; break;
				case "h8": if(this.Helpers.getPieceColor(piece) === Chess.Colors.BLACK) this.allowableSpecialMoves |= 4; break;
			}
		}

		if(piece.toUpperCase() === "K") {
			if(this.Helpers.getPieceColor(piece) === Chess.Colors.WHITE) this.allowableSpecialMoves |= 3;
			if(this.Helpers.getPieceColor(piece) === Chess.Colors.BLACK) this.allowableSpecialMoves |= 12;
		}

		this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex(newBoardIndex), piece);
		this.state = this.state.replaceAt(this.Helpers.boardCoordinatesToIndex(currentBoardIndex), " ");
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

				//handle castling
				if(color === Chess.Colors.WHITE && (this.allowableSpecialMoves & 3) !== 3 && !this.isPositionInCheck(i, Chess.Colors.WHITE)) {
					if((this.allowableSpecialMoves & 1) !== 1 && this.getPieceAt("f1") === " " && this.getPieceAt("g1") === " " && this.getPieceAt("h1") === Chess.Pieces.White.ROOK &&
						!this.isPositionInCheck("f1",Chess.Colors.WHITE) && !this.isPositionInCheck("g1",Chess.Colors.WHITE))
						moves.unshift("Ke1g1");
					if((this.allowableSpecialMoves & 2) !== 2 && this.getPieceAt("d1") === " " && this.getPieceAt("c1") === " " && this.getPieceAt("b1") === " " && this.getPieceAt("a1") === Chess.Pieces.White.ROOK && 
						!this.isPositionInCheck("d1",Chess.Colors.WHITE) && !this.isPositionInCheck("c1",Chess.Colors.WHITE) && !this.isPositionInCheck("b1",Chess.Colors.WHITE)) 
						moves.unshift("Ke1c1");
				} else if(color === Chess.Colors.BLACK && (this.allowableSpecialMoves & 12) !== 12 && !this.isPositionInCheck(i, Chess.Colors.BLACK)) {
					if((this.allowableSpecialMoves & 4) !== 4 && this.getPieceAt("f8") === " " && this.getPieceAt("g8") === " " && this.getPieceAt("h8") === Chess.Pieces.Black.ROOK && 
						!this.isPositionInCheck("f8",Chess.Colors.BLACK) && !this.isPositionInCheck("g8",Chess.Colors.BLACK))
						moves.unshift("Ke8g8");
					if((this.allowableSpecialMoves & 8 !== 8) && this.getPieceAt("d8") === " " && this.getPieceAt("c8") === " " && this.getPieceAt("b8") === " " && this.getPieceAt("a8") === Chess.Pieces.Black.ROOK && 
						!this.isPositionInCheck("d8",Chess.Colors.BLACK) && !this.isPositionInCheck("c8",Chess.Colors.BLACK) && !this.isPositionInCheck("b8",Chess.Colors.BLACK)) 
						moves.unshift("Ke8c8");
				}

			} else if(piece === Chess.Pieces[color].QUEEN) {
				diag = true;
				straight = true;
				dist = 8;
			} else if(piece === Chess.Pieces[color].KNIGHT) {
				[[-2,-1],[-2,1],[-1,-2],[-1,2],[2,-1],[2,1],[1,-2],[1,2]].forEach(function(positionOffset) {
					var positionIndex = i + (positionOffset[0] * 8) + positionOffset[1];
					if(positionIndex <= 63 && positionIndex >= 0 && Math.floor((i + (positionOffset[0] * 8)) / 8) === Math.floor(positionIndex / 8)) {
						var pieceAtPosition = this.state.charAt(positionIndex);

						if(pieceAtPosition === " " || this.Helpers.getPieceColor(pieceAtPosition) !== color)
							(pieceAtPosition !== " " ? moves.unshift.bind(moves) : moves.push.bind(moves))(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
					}
				}.bind(this));
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
				var pawnInEndRow = function(pIndex) {return (pIndex >= 0 && pIndex <= 7) || (pIndex >= 56 && pIndex <= 63)};

				if(pawnForward1 >= 0 && pawnForward1 <= 63 && this.getPieceAt(pawnForward1) === " ") {
					if(pawnInEndRow(pawnForward1)) {
						for(var key in Chess.Pieces[color]) 
							if(key !== "KING" && key !== "PAWN") 
								moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForward1) + Chess.Pieces[color][key].toUpperCase());
					} else moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForward1));
				}

				if(pawnInHomePosition && pawnForward2 >= 0 && pawnForward2 <= 63 && this.getPieceAt(pawnForward2) === " " && this.getPieceAt(pawnForward1) === " ") {
					if(pawnInEndRow(pawnForward2)) {
						for(var key in Chess.Pieces[color]) 
							if(key !== "KING" && key !== "PAWN") 
								moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForward2) + Chess.Pieces[color][key].toUpperCase());
					} else moves.push(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForward2));
				}

				if(pawnForwardLeft >= 0 && pawnForwardLeft <= 63 &&
					this.getPieceAt(pawnForwardLeft) !== " " && this.Helpers.getPieceColor(this.getPieceAt(pawnForwardLeft)) !== color && 
					Math.floor((i + pawnDirection * 8) / 8) === Math.floor(pawnForwardLeft / 8)) {
		
					if(pawnInEndRow(pawnForwardLeft)) {
						for(var key in Chess.Pieces[color])
							if(key !== "KING" && key !== "PAWN") 
								moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForwardLeft) + Chess.Pieces[color][key].toUpperCase());
					} else moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForwardLeft));
				}

				if(pawnForwardRight >= 0 && pawnForwardRight <= 63 &&
					this.getPieceAt(pawnForwardRight) !== " " && this.Helpers.getPieceColor(this.getPieceAt(pawnForwardRight)) !== color && 
					Math.floor((i + pawnDirection * 8) / 8) === Math.floor(pawnForwardRight / 8)) {
	
					if(pawnInEndRow(pawnForwardRight)) {
						for(var key in Chess.Pieces[color])
							if(key !== "KING" && key !== "PAWN") 
								moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForwardRight) + Chess.Pieces[color][key].toUpperCase());
					} else moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(pawnForwardRight));
				}
			}
		}



		function getDiagonalMoves(distance, startPos) {
			//up left, up right, down left, down right
			//dir[0] = up/down, dir[1] = left/right
			[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(dir) {
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
							moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}
			}.bind(this));
		}

		function getStraightMoves(distance, startPos) {
			//up, down, left, right
			//dir[0] = up/down, dir[1] = left/right
			[[-1,0],[1,0],[0,-1],[0,1]].forEach(function(dir) {
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
							moves.unshift(currentPiece + currentLocation + this.Helpers.indexToBoardCoordinates(positionIndex));
							break;
						}
					}
				}
			}.bind(this));
		}

		return moves;
	};

	Board.prototype.isKingInCheck = function(color) {
		var kingPos;
		var kingInDanger = false;
		for(var i=0; i<this.state.length; i++) {
			if(this.state.charAt(i).toUpperCase() === "K" && this.Helpers.getPieceColor(this.state.charAt(i)) === color) {
				kingPos = i;
				break;
			}
		}

		return this.isPositionInCheck(kingPos, color);
	}

	Board.prototype.isPositionInCheck = function(pos, color) {
		var self = this;
		var danger = false;

		if(typeof pos !== "number")
			pos = this.Helpers.boardCoordinatesToIndex(pos);

		//up left, up right, down left, down right
		//dir[0] = up/down, dir[1] = left/right
		[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(dir) {
			if(danger) return;
			var lastMod8 = pos % 8;
			for(var i=1; i<=8; i++) {
				var positionIndex = pos + (dir[0]*i*8) + (dir[1]*i);
				if(dir[1] < 0 && positionIndex % 8 >= lastMod8) break;
				if(dir[1] > 0 && positionIndex % 8 <= lastMod8) break;
				if(positionIndex < 0 || positionIndex > 63) break;

				var pieceAtPosition = self.state.charAt(positionIndex);
				if(pieceAtPosition !== " ") {
					if(self.Helpers.getPieceColor(pieceAtPosition) !== color) {
						var piece = pieceAtPosition.toUpperCase();
						if(piece === "Q" || piece === "B") danger = true;
						else if(piece === "K" && i === 1) danger = true;
						else if(piece === "P" && i === 1 && color === Chess.Colors.BLACK && Math.floor(positionIndex / 8) > Math.floor(pos / 8)) danger = true;
						else if(piece === "P" && i === 1 && color === Chess.Colors.WHITE && Math.floor(positionIndex / 8) < Math.floor(pos / 8)) danger = true;
					}
					break;
				}
			}
		});

		//up, down, left, right
		//dir[0] = up/down, dir[1] = left/right
		[[-1,0],[1,0],[0,-1],[0,1]].forEach(function(dir) {
			if(danger) return;
			for(var i=1; i<=8; i++) {
				var positionIndex = pos + (dir[0]*i*8) + (dir[1]*i);
				if(dir[0] === 0 && Math.floor(pos / 8) !== Math.floor(positionIndex / 8)) break;
				if(positionIndex < 0 || positionIndex > 63) break;

				var pieceAtPosition = self.state.charAt(positionIndex);

				if(pieceAtPosition !== " ") {
					if(self.Helpers.getPieceColor(pieceAtPosition) !== color) {
						var piece = pieceAtPosition.toUpperCase();
						if(piece === "Q" || piece === "R") danger = true;
						else if(piece === "K" && i === 1) danger = true;
					}
					break;
				}
			}
		});

		[[-2,-1],[-2,1],[-1,-2],[-1,2],[2,-1],[2,1],[1,-2],[1,2]].forEach(function(positionOffset) {
			if(danger) return;
			var positionIndex = pos + (positionOffset[0] * 8) + positionOffset[1];
			if(positionIndex <= 63 && positionIndex >= 0 && Math.floor((pos + (positionOffset[0] * 8)) / 8) === Math.floor(positionIndex / 8)) {
				var pieceAtPosition = self.state.charAt(positionIndex);

				if(pieceAtPosition.toUpperCase() === "N" && self.Helpers.getPieceColor(pieceAtPosition) !== color) danger = true;
			}
		});

		return danger;
	};

	Board.prototype.toString = function() {
		var str = "\n";
		for(var i=0; i<this.state.length; i+=8) 
			str += (8-(i/8)) + " " + this.state.slice(i,i+8) + '\n';

		str += "\n  ";
		['a','b','c','d','e','f','g','h'].forEach(function(file) {str += file;});

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