var Chess = {
	isMyTurn: false,
	color: "",
	moveStack: [],
	lastMoveNumber: -1,
	secondsLeft: -1,
	boardState: null,
	gameId: -1,
	teamNumber: 205,
	teamSecret: "fa62a752",
	init: function(gId, color) {
		this.gameId = gId;
		this.color = color.match(/white|w/i).length > 0 ? "W" : "B";
		this.boardState = new this.Board();
		this.Rating = new this.Rating();
		this.ServerInterface.poll();
	}
};

//adding additional functionality to classes
String.prototype.replaceAt = function(index, ch) {
	return this.substr(0,index) + ch + this.substr(index+ch.length);
}