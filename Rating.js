(function(){
	
	var Chess = require('./Chess');

	var Rating = function(){
		this.boardState=null;
		this.pawnBoardWhite = [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0],
    this.pawnBoardBlack = [
    0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10,-20,-20, 10, 10,  5,
     5, -5,-10,  0,  0,-10, -5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5,  5, 10, 25, 25, 10,  5,  5,
    10, 10, 20, 30, 30, 20, 10, 10,
    50, 50, 50, 50, 50, 50, 50, 50,
     0,  0,  0,  0,  0,  0,  0,  0],

    this.rookBoardWhite = [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0],

    this.rookBoardBlack = [
     0,  0,  0,  5,  5,  0,  0,  0,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     5, 10, 10, 10, 10, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0],

    this.knightBoardWhite = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50],
    this.knightBoardBlack = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50],
    
    this.bishopBoardWhite= [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20],

    this.bishopBoardBlack = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -20,-10,-10,-10,-10,-10,-10,-20],

    this.queenBoardWhite = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20],

    this.queenBoardBlack = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -10,  5,  5,  5,  5,  5,  0,-10,
      0,  0,  5,  5,  5,  5,  0, -5,
     -5,  0,  5,  5,  5,  5,  0, -5,
    -10,  0,  5,  5,  5,  5,  0,-10,    
    -10,  0,  0,  0,  0,  0,  0,-10,    
    -20,-10,-10, -5, -5,-10,-10,-20],

    this.kingMidBoardWhite = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20],


    this.kingMidBoardBlack = [
     20, 30, 10,  0,  0, 10, 30, 20,
     20, 20,  0,  0,  0,  0, 20, 20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30],

    this.kingEndBoardWhite = [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50],

    this.kingEndBoardBlack = [
    -50,-30,-30,-30,-30,-30,-30,-50,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,   
    -30,-20,-10,  0,  0,-10,-20,-30,
    -50,-40,-30,-20,-20,-30,-40,-50]

	
	}

	Rating.prototype.getRating = function(board, playerColor, moveListLength, depth) {
		
		this.boardState = board;
		var counter =0, material=this.rateMaterial(playerColor);
		var oppColor = Chess.Helpers.flipColor(playerColor);
		//for our team color
		counter+= this.rateAttack(playerColor);
		counter+= material;
		counter+= this.rateMovebility(playerColor,moveListLength, depth, material);
		counter+= this.ratePostional(playerColor,moveListLength, depth, material);
		//for the other team color
		material=this.rateMaterial(oppColor);
		counter-= this.rateAttack(oppColor);
		counter-= material;
		counter-= this.rateMovebility(oppColor, moveListLength, depth, material);
		counter-= this.ratePostional(oppColor, moveListLength, depth, material);
		
		return -(counter+depth*50);
	};

	Rating.prototype.rateAttack = function(color){
		//TODO
		var counter =0;
		for (var i =0; i<64; i++){
			var piece = this.boardState.getPieceAt(i);
			if (piece !==' '){
				if (this.boardState.Helpers.getPieceColor(piece)===color){
					var amount =0;
					switch(piece.toUpperCase()){
						//centipawns, no decimals mang
						case "P": 
							amount =64;
							break;
						case 'R':
							//move current kind to position of rook
							amount =500;
						 	break;
						case 'N':
							//move current kind to position of knight
							amount =300;
							break;
						case 'B': 
							//move current kind to position of bishop
							amount=300;
							break;
						case 'Q':
							//move current kind to position of queen
							amount=900;
							break;
						case 'K': 
							//move current position of king
							amount=200;
						break;

					}
					//check if king would be in check at position
					if (this.boardState.isPositionInCheck(i, color))
						counter-=amount;
				}
			}
		}
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
		if (moveListLength ===0){ //current side is in checkmate or stalemate
			if (this.boardState.isKingInCheck(color)){
				counter-=200000*depth;
			}
			else{
				counter-=150000*depth;
			}		
		}
		return counter;
	}

	Rating.prototype.ratePostional = function(color, material){

		var counter =0;
		for (var i =0; i<64; i++){
			var piece = this.boardState.getPieceAt(i);
			if (piece !==' '){
				if (this.boardState.Helpers.getPieceColor(piece)===color){
					
						//centipawns, no decimals mang
						if (color===Chess.Colors.WHITE){
							//
							switch(piece.toUpperCase()){

							case "P": counter+=this.pawnBoardWhite[i]; 	break;
							case 'R': counter+=this.rookBoardWhite[i]; 	break;
							case 'N': counter+=this.knightBoardWhite[i]; 	break;
							case 'B': counter+=this.bishopBoardWhite[i]; 	break;
							case 'Q': counter+=this.queenBoardWhite[i]; 	break;
							case 'K': 
								if (material>=1750){
									counter+=this.kingMidBoardWhite[i];
									//TODO add a function to board to give the possible moves of the king *10
								}
								else{
									counter+=this.kingEndBoardWhite[i];
									//TODO add a function to board to give the possible moves of the king *30	
								}
								break;
							}
						}
						else {
							switch(piece.toUpperCase()){
							case "P": counter+=this.pawnBoardBlack[i]; 		break;
							case 'R': counter+=this.rookBoardBlack[i]; 		break;
							case 'N': counter+=this.knightBoardBlack[i]; 	break;
							case 'B': counter+=this.bishopBoardBlack[i]; 	break;
							case 'Q': counter+=this.queenBoardBlack[i]; 		break;
							case 'K': 
								if (material>=1750){
									counter+=this.kingMidBoardBlack[i];
									//TODO add a function to board to give the possible moves of the king *10
								}
								else{
									counter+=this.kingEndBoardBlack[i];
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