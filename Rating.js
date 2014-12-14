(function(){
	
	var Chess = require('./Chess');

	var Rating = function(){
		this.boardState='';
	}

	Rating.prototype.getRating = function(board, moveListLength, depth) {
		this.boardState = board;
		var counter =0, material=this.rateMaterial(Chess.color);
		var oppColor = Chess.Helpers.flipColor(Chess.color);
		//for our team color
		//counter+= this.rateAttack(Chess.color);
		counter+= material;
		//counter+= this.rateMovebility(Chess.color);
		//counter+= this.ratePostional(Chess.color,moveListLength, depth, material);
		//for the other team color
		material=this.rateMaterial(oppColor);
		//counter-= this.rateAttack(oppColor);
		counter-= material;
		//counter-= this.rateMovebility(oppColor, moveListLength, depth, material);
		//counter-= this.ratePostional(oppColor, material);
		
		return -(counter+depth*50);
	};

	Rating.prototype.rateAttack = function(color){
		//TODO
		var counter =0;
		var tempPosKing = 0;//position of this color king
		for (var i =0; i<64; i++){
			var piece = this.boardState.getPieceAt(i);
			if (piece !==' '){
				if (this.boardState.Helpers.getPieceColor(piece)===color){
					switch(piece.toUpperCase()){
						//centipawns, no decimals mang
						case "P": 
							//move current kind to position of pawn
							//if kind isnt safe counter-=64
							break;
						case 'R':
							//move current kind to position of rook
							//if kind isnt safe counter-=500
						 	break;
						case 'N':
							//move current kind to position of knight
							//if kind isnt safe counter-=300
							break;
						case 'B': 
							//move current kind to position of bishop
							//if kind isnt safe counter-=300
							break;
						case 'Q':
							//move current kind to position of queen
							//if kind isnt safe counter-=900
							break;
						case 'K': 
							//move current position of king
							//if kind isnt safe counter-=200

						break;

					}
				}
			}
		}
		//reset king position to temp
		return counter/2;
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
						if (color===Chess.Colors.WHITE){
							//debugger;
							switch(piece.toUpperCase()){

							case "P": counter+=RatingReference.pawnBoardWhite[i]; 	break;
							case 'R': counter+=RatingReference.rookBoardWhite[i]; 	break;
							case 'N': counter+=RatingReference.knightBoardWhite[i]; 	break;
							case 'B': counter+=RatingReference.bishopBoardWhite[i]; 	break;
							case 'Q': counter+=RatingReference.queenBoardWhite[i]; 	break;
							case 'K': 
								if (material>=1750){
									counter+=RatingReference.kingMidBoardWhite[i];
									//TODO add a function to board to give the possible moves of the king *10
								}
								else{
									counter+=RatingReference.kingEndBoardWhite[i];
									//TODO add a function to board to give the possible moves of the king *30	
								}
								break;
							}
						}
						else {
							switch(piece.toUpperCase()){
							case "P": counter+=RatingReference.pawnBoardBlack[i]; 		break;
							case 'R': counter+=RatingReference.rookBoardBlack[i]; 		break;
							case 'N': counter+=RatingReference.knightBoardBlack[i]; 	break;
							case 'B': counter+=RatingReference.bishopBoardBlack[i]; 	break;
							case 'Q': counter+=RatingReference.queenBoardBlack[i]; 		break;
							case 'K': 
								if (material>=1750){
									counter+=RatingReference.kingMidBoardBlack[i];
									//TODO add a function to board to give the possible moves of the king *10
								}
								else{
									counter+=RatingReference.kingEndBoardBlack[i];
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