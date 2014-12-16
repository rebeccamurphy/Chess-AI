(function() {

	var Chess = require('./Chess');

	var AI = function() {
		this.limitDepth= 4;
		this.alpha = -Infinity;
		this.beta = Infinity;
	};

	Chess.AI = new AI();


	AI.prototype.sortMoves = function(list){
		var score =[];
		for (var i =0; i<list.length; i++){
			var boardCopy = Chess.Board.clone();
			boardCopy.makeMove(list[i]);
			score.push(-boardCopy.eval());
		}
		var newListA =[];
		var newListB =list.slice();

		for (var i = 0; i <Math.min(6, list.length); i++){//first few moves only
			var max = -Infinity, maxLocation =0;
			for (var j=0; j<list.length; j++){
				if (score[j] > max){
					max = score[j];
					maxLocation=j;
				}
			score[maxLocation]= -Infinity;
			newListA.push(list[maxLocation]);
			newListB.splice(maxLocation, 1);
			}
		}

		return newListA.push.apply(newListA, newListB);

	}

	AI.prototype.alphaBeta = function(depth, alpha, beta, move, board, player) {
		//
		var playerColor = (player===0)? Chess.color :Chess.Helpers.flipColor(Chess.color);
		
		var moveList =board.generateNextMoves(playerColor);
		if (depth===0|| moveList.length ===0){
			board.move(move);
			if (board.isKingInCheck(playerColor))
				return [move, Infinity*(player*2-1)]; 
			else 
				return [move, board.eval(playerColor, moveList.length, depth) *(player*2-1)]; 
		}
		//moveList = this.sortMoves(moveList);

		//sort moveList later;
		//remove moves that make king in check

		//flip player
		player=1-player;
		for (var i=0;i<moveList.length; i++){
			var moveInList = moveList[i];
			var boardCopy = board.clone();
			boardCopy.move(moveInList);
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
		if (player===0) {
			return [move, beta];
		}
		else {
			return [move, alpha];
		}
	}



})();