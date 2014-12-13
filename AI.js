(function() {
	var AI = function() {
		this.limitDepth= 2;
		this.currDepth =0;
		this.myTurn = true;
		this.alpha = -Infinity;
		this.beta = Infinity;
	};

	Chess.AI = new AI();


	AI.prototype.alpaBetaMinimax = function(node, alpha, beta) {
	/*
	   Returns best score for the player associated with the given node.
	   Also sets the variable bestMove to the move associated with the
	   best score at the root node.  
	*/
	   // check if at search bound
	   if (this.limitDepth===this.currDepth)
	      return node.eval();

	   //check if leaf
	   var children = node.generateNextStates(true);
	  
	   if (children.length === 0){
	      if (node.state=== Chess.Board.state)//node is root
	        bestMove = [] 
	      return node.eval();
		}
	   // initialize bestMove
	   if (node.state=== Chess.Board.state) {//node is root
	      bestMove = children[0][0];//best move string
	      //check if there is only one option
	      if (children.length === 1)
	         return;
	   }
	   if (this.myTurn){
	   	this.myTurn=false;
	      for (var child in children){
	         var result = alphaBetaMinimax(child, alpha, beta)
	         if (result > alpha){
	            alpha = result
	            if (node.state===Chess.board.state)//node is root
	               bestMove = child[0];
	         }
	         if (alpha >= beta)
	            return alpha
	      }
	      return alpha

	   }
	   else if (!this.myTurn){
	      for (var child in children)
	         result = alphaBetaMinimax(child, alpha, beta)
	         if (result < beta){
	            beta = result
	            if (node.state===Chess.board.state)//node is root
	               bestMove = child[0];
	         }
	         if (beta <= alpha)
	            return beta
	      return beta
   		}
	}
})();