(function(){
	
	var Rating = function(){
		this.boardState='';
	}

	Rating.prototype.getRating = function(board, moveListLength, depth) {
		this.boardState = board;
		var counter =0, material=this.rateMaterial(Chess.color);
		var oppColor = Chess.Helpers.flipColor(Chess.color);
		//for our team color
		counter+= this.rateAttack(Chess.color);
		counter+= material;
		counter+= this.rateMovebility(Chess.color);
		counter+= this.ratePostional(Chess.color,moveListLength, depth, material);
		//for the other team color
		material=this.rateMaterial(oppColor);
		counter-= this.rateAttack(oppColor);
		counter-= material;
		counter-= this.rateMovebility(oppColor, moveListLength, depth, material);
		counter-= this.ratePostional(oppColor, material);
		
		return -(counter+depth*50);
	};

	Rating.prototype.rateAttack = function(color){
		return 0;
	}

	Rating.prototype.rateMaterial =function(color){
		var counter =0, bishopCounter=0;
		for (var i =0; i<64; i++){
			var piece = this.boardState.getPieceAt(i);
			if (piece !==' '){
				if (this.boardState.Helpers.getPieceColor(piece)===color){
					switch(piece.toUpperCase()){
						//centipawns, no decimals mang
						case "P": counter+=100; 	break;
						case 'R': counter+=500; 	break;
						case 'N': counter+=300; 	break;
						case 'B': bishopCounter++; 	break;
						case 'Q': counter+=900; 	break;
						//case 'K': counter+=10000; 	break;

					}
				}
			}
		}
		if (bishopCounter>=2)
			counter+= 300*bishopCounter;
		else if (bishopCounter===1)
			counter+=250;

		return counter;
	}
	
	Rating.prototype.rateMovebility= function (color, moveListLength, depth, material){
		var counter = 0;
		counter+= moveListLength *5; //5 points per valid move
		if (moveListLength ===0){//current side is in checkmate or stalemate
			/*if (!kingSafe){
				counter-=200000*depth;
				}
			 else{
				counter-=150000*depth;
			 }
			*/
			
		}
		return counter;
	};

	Rating.prototype.ratePostional = function(color, material){
		var counter =0;
		for (var i =0; i<64; i++){
			var piece = this.boardState.getPieceAt(i);
			if (piece !==' '){
				if (this.boardState.Helpers.getPieceColor(piece)===color){
					
						//centipawns, no decimals mang
						if (color===Chess.colors.WHITE){
							switch(piece.toUpperCase()){
							case "P": counter+=pawnBoardWhite[i/8][i%8]; 	break;
							case 'R': counter+=rookBoardWhite[i/8][i%8]; 	break;
							case 'N': counter+=knightBoardWhite[i/8][i%8]; 	break;
							case 'B': counter+-bishopBoardWhite[i/8][i%8]; 	break;
							case 'Q': counter+=queenBoardWhite[i/8][i%8]; 	break;
							case 'K': 
								if (material>=1750){
									counter+=kingMidBoardWhite[i/8][i%8];
									//TODO add a function to board to give the possible moves of the king *10
								}
								else{
									counter+=kingEndBoardWhite[i/8][i%8];
									//TODO add a function to board to give the possible moves of the king *30	
								}
								break;
							}
						}
						else {
							switch(piece.toUpperCase()){
							case "P": counter+=pawnBoardBlack[i/8][i%8]; 	break;
							case 'R': counter+=rookBoardBlack[i/8][i%8]; 	break;
							case 'N': counter+=knightBoardBlack[i/8][i%8]; 	break;
							case 'B': counter+-bishopBoardBlack[i/8][i%8]; 	break;
							case 'Q': counter+=queenBoardBlack[i/8][i%8]; 	break;
							case 'K': 
								if (material>=1750){
									counter+=kingMidBoardBlack[i/8][i%8];
									//TODO add a function to board to give the possible moves of the king *10
								}
								else{
									counter+=kingEndBoardBlack[i/8][i%8];
									//TODO add a function to board to give the possible moves of the king *30	
								}
								break;
							}
						}
					}
				}
			}
		return counter;
	}
	Chess.Rating = Rating;
})();