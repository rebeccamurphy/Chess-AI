(function() {
	var AI = function() {
		this.limitDepth= 4;
		this.currDepth =0;
		this.myTurn = true;
		this.alpha = -Infinity;
		this.beta = Infinity;
	};

	Chess.AI = new AI();


	AI.prototype.alphaBeta = function(depth, alpha, beta, move, board, player) {
		var playerColor ='';
		if (player===0)
			playerColor = Chess.color;
		else if (Chess.color===Chess.Colors.WHITE)
			playerColor=Chess.Colors.BLACK;
		else
			playerColor=Chess.Colors.WHITE;

		var moveList =board.generateNextStates(playerColor);
		if (depth===0|| moveList.length ===0){
			board.move(move);
			return [move, board.eval(playerColor) *(player*2-1)]; 
		}
		//sort moveList later;

		//flip player
		player=1-player;
		for (var move in moveList){
			var boardCopy = board.clone();
			boardCopy.move(move);
			var returnMove = this.alphaBeta(depth-1, alpha, beta, move, boardCopy, player);
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

	AI.prototype.SPPAlphaBeta= function(board,  depth, alpha, beta){/*
			 int value = 0;
			 if(board.isEnded())
			 return evaluate(board); 
			 int best = -MATE-1;
			 int move; ChessBoard nextBoard;
			 board.getOrderedMoves();
			 while (board.hasMoreMoves()) 
			 {
			 move = board.getNextMove();
			 nextBoard = board.move(move);
			 if(depth == 1)
			 {
			 // negamax principle: value is negative of evaluation nextBoard
			 value = - evaluate(nextBoard);
			if(Move.isHIT(move) || Move.isCheck(move) || Move.isPromotion(move))
			 {
			28
			Figure 8: SPP cut-off
			9 7 1
			Positions with defined 
			spatial locality
			Positions resulting from
			active moves
			SPP (cut-off) // active move gets usual treatment
			 if(value > best)
			 best = value;
			 }
			 else
			 {
			 // passive move – sibling with spatial locality
			 if(value > best)
			 best = value;
			 else if((best > value + MPD) || (alpha > value + MPD))
			 break; // prune (break from loop; done)
			 }
			 }
			 else
			 {
			 value = -SPPAlphaBeta(nextBoard, depth-1,-beta,-alpha);
			 if(value > best)
			 best = value;
			 }
			 if(best > alpha)
			 alpha = best;
			 if(best >= beta)
			 break;
			 }
			 return best;
			

		*/
}


})();