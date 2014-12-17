(function() {

	var Chess = require('./Chess');

	var AI = function() {
		this.limitDepth= 4;
		this.alpha = -Infinity;
		this.beta = Infinity;
	};

	Chess.AI = new AI();


	AI.prototype.sortMoves = function(list, playerColor, depth, player){
		debugger;
		var score =[];
		for (var i =0; i<list.length; i++){
			var boardCopy = Chess.boardState.clone();
			boardCopy.move(list[i]);
			score.push(boardCopy.eval(playerColor, -1, 0)) ;
		}
		var newListA =[];
		var newListB =score.slice();
		var max=0;
		for (var i = 0; i <Math.min(6, list.length); i++){//first few moves only
			max = Math.max.apply( Math, newListB);
			var indexOfMax = score.indexOf(max);
			newListA.push(list[indexOfMax]);
			newListB.splice(newListB.indexOf(max), 1);
		}

		return newListA;
	}

	AI.prototype.alphaBeta = function(depth, alpha, beta, move, board, player, loopMove) {
		debugger;
		var playerColor = (player===0)? Chess.color :Chess.Helpers.flipColor(Chess.color);
		
		var moveList =board.generateNextMoves(playerColor);

		//moveList = Chess.AI.sortMoves(moveList, playerColor, depth);

		if (loopMove !==undefined){
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