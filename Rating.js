(function(){
	
	var Rating = function(){
	}	

	Rating.prototype.getRating = function() {
		var counter =0;
		//for our team color
		counter+= rateAttack();
		counter+= rateMaterial();
		counter+= rateMovebility();
		counter+= ratePostional();
		//for the other team color
		counter-= rateAttack();
		counter-= rateMaterial();
		counter-= rateMovebility();
		counter-= ratePostional();
		
		return counter;
	};

	Rating.prototype.rateAttack = function(){
		return 0;
	}

	Rating.prototype.rateMaterial =function(){
		return 0;
	}
	
	Rating.prototype.rateMovebility= function (){
		return 0;
	};

	Rating.prototype.ratePostional = function(){
		return 0;
	}
});