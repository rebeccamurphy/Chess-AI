(function() {

	var Chess = require('./Chess');

	var AI = function() {
		this.limitDepth= 4;
		this.alpha = -Infinity;
		this.beta = Infinity;
		this.sortMoves = function (moves,scores) {return moves.map(function(move, i) {return {m: move, s: scores[i]}}).sort(function(a,b) {return b.s-a.s;}).map(function(o) {return o.m;})}
	};

	Chess.AI = new AI();


	AI.prototype.sortMoves = function(moves, playerColor, depth, board){
		
		var scores =[];
		for (var i =0; i<moves.length; i++){
			var boardCopy = Chess.boardState.clone();
			boardCopy.move(moves[i]);
			scores.push(boardCopy.eval(playerColor, -1, 0)) ;
		}

		return this.sortMoves(moves, scores);
	}


	AI.prototype.alphaBeta = function(depth, alpha, beta, move, board, player, loopMove) {
		
		var playerColor = (player===0)? Chess.color :Chess.Helpers.flipColor(Chess.color);
		
		var moveList =board.generateNextMoves(playerColor);

		moveList = Chess.AI.sortMoves(moveList, playerColor, depth, board);
		if (Chess.boardState.isKingInCheck(Chess.color)&&depth === this.limitDepth){
			//make sure to move king out of checkmate
			console.log('moving king out of checkmate');
			for (var i=0;i<moveList.length; i++){
				//console.log(moveList);
				var moveInList = moveList[i];
				var boardCopy = board.clone();
				boardCopy.move(moveInList);
				if (!boardCopy.isKingInCheck(Chess.color)){
					return [moveInList];
				}
			
			}
			//king is in checkmate so just do a random move so they can take our king
			return[moveList[0]];
		}

		if (loopMove !==undefined && Chess.cacheLimit<moveList.length){
			for (var i=0; i<moveList.length; i++){
				if (moveList[i].toUpperCase()===loopMove.toUpperCase()){
					moveList.splice(i,1);	
					break;
				}
			}
		}

		if (depth===0|| moveList.length ===0){
			board.move(move);
			return [move, board.eval(playerColor, moveList.length, depth) *(player*2-1)]; 
		}

		if (depth===this.limitDepth){
			//return move if it immediately takes the king
			for (var  i =0; i< moveList.length; i++){
				var moveInList = moveList[i];
				var piece = board.getPieceAt(moveInList.slice(-2));
				if (piece.toUpperCase() === 'K' && board.Helpers.getPieceColor(piece)===Chess.opponentColor){
					return [moveInList];
				}

			}
		}


		//sort moveList later;
		//remove moves that make king in check

		//flip player
		player=1-player;
		for (var i=0;i<moveList.length; i++){
			var moveInList = moveList[i];
			var boardCopy = board.clone();
			boardCopy.move(moveInList);
			//check that the move is not illegal, if so don't use it.
			if (!boardCopy.isKingInCheck(playerColor)){

				var returnMove = this.alphaBeta(depth-1, alpha, beta, moveInList, boardCopy, player);
				var value = returnMove[1];
				//flipBoard
				if (player===0){
					if (value<=beta){
						beta=value;
						if (depth===this.limitDepth){
							move=returnMove[0];
						}
					}
				}
				else{
					if (value>alpha){
						alpha=value;
						if (depth===this.limitDepth){
							move=returnMove[0];
						}
					}

				}
				if (alpha>=beta){
					if(player===0){
						return [move, beta];
					}
					else{
						return [move, alpha];
					}
				}
			}

		}
		if (player===0) {
			return [move, beta];
		}
		else {
			return [move, alpha];
		}
	}



})();