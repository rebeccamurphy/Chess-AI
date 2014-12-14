(function(){
	
	var Rating = function(){

	}	

	Rating.prototype.getRating = function(state, moveListLength, depth) {
		var counter =0;
		var oppColor = Chess.Helpers.flipColor(Chess.color);
		//for our team color
		counter+= rateAttack(Chess.color);
		counter+= rateMaterial(Chess.color);
		counter+= rateMovebility(Chess.color);
		counter+= ratePostional(Chess.color);
		//for the other team color
		counter-= rateAttack(oppColor);
		counter-= rateMaterial(oppColor);
		counter-= rateMovebility(oppColor);
		counter-= ratePostional(oppColor);
		
		return -(counter+depth*50);
	};

	Rating.prototype.rateAttack = function(color){
		return 0;
	}

	Rating.prototype.rateMaterial =function(color){
		var counter =0, bishopCounter=0;
		for (var i =0; i<Chess.Board.state.length; i++){
			var piece = Chess.Board.getPieceAt(i);
			if (piece !==' '){
				if (Chess.Board.Helpers.getPieceColor(piece)===color){
					switch(piece.toUpperCase()){
						//centipawns, no decimals mang
						case "P": counter+=100; 	break;
						case 'R': counter+=500; 	break;
						case 'N': counter+=300; 	break;
						case 'B': bishopCounter++; 	break;
						case 'Q': counter+=900; 	break;
						case 'K': counter+=10000; 	break;

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
	
	Rating.prototype.rateMovebility= function (color){
		return 0;
	};

	Rating.prototype.ratePostional = function(color){
		return 0;
	}
});