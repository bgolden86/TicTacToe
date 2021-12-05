function main(){

	let controller = new Controller(new TicTacToe(),new TicTacToeView());
	window.addEventListener("mousedown", function(event){
		controller.playMove(event.clientX, event.clientY);
	});
}

class Controller{
	constructor(model, view){
		this.model = model;
		this.view = view;
		this.view.drawBoard(this.model.getBoard())
	}

	playMove(x,y){
		if(this.model.gameOver()){
			this.view.clear();
			this.model.clear();
		}
		else{
			let gridWidth = this.view.canvas.width/3;
			let gridHeight = this.view.canvas.height/3;
			console.log(x + "  " + y);
			let rect = this.view.canvas.getBoundingClientRect();
			this.model.playTurn(Math.floor((y - rect.top )/ gridHeight), Math.floor((x - rect.left )/ gridWidth));
			this.view.drawBoard(this.model.getBoard())
		}

		if(this.model.gameOver()){
			this.view.drawResult(this.model.finalGameResult());
		}
	}
}


class TicTacToe{
	constructor(){
		this.board = [[0,0,0],
									[0,0,0],
									[0,0,0]];
		this.turn = true;
	}

	clear(){
		for(let i = 0; i < this.board.length; i++){
			for(let j = 0; j < this.board[i].length; j++){
				this.board[i][j] = 0;
			}
		}
	}

	getBoard(){
		return this.board;
	}

	tie(){
		 for(let i = 0; i < this.board.length; i++){
			 for(let j = 0; j < this.board[i].length; j++){
				 if(this.board[i][j] == 0){
					 return false;
				 }
			 }
		 }
		 return !this.win();
	}

	leftDiagnalWin(){
		for(let i = 0; i < 3; i++){
			if(this.board[i][i] == 0){
				return false;
			}
		}
		return this.board[0][0] == this.board[1][1] && this.board[1][1]  == this.board[2][2];
	}

	rightDiagonalWin(){
		for(let i = 0; i < 3; i++){
			if(this.board[2 - i][i] == 0){
				return false;
			}
		}
		return this.board[2][0] == this.board[1][1] && this.board[1][1]  == this.board[0][2];
	}

	verticalWin(){
		for(let j = 0; j < 3; j++){
			let found = false;
			for(let i = 0; i < 3 && !found; i++){
				if(this.board[i][j] == 0){
					found = true;
				}
			}
			if(!found && this.board[0][j] == this.board[1][j] && this.board[1][j] == this.board[2][j]){
				return true;
			}
		}
		return false;
	}


	horizontalWin(){
		for(let i = 0; i < 3; i++){
			let found = false;
			for(let j = 0; j < 3 && !found; j++){
				if(this.board[i][j] == 0){
					found = true;
				}
			}
			if(!found && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]){
				return true;
			}
		}
		return false;
	}

	win(){
		return this.leftDiagnalWin() || this.rightDiagonalWin() || this.horizontalWin() || this.verticalWin();
	}

	gameOver(){
		return this.win() || this.tie();
	}

	isValid(i, j){
		
		return 0 <= i && i <= 2 && 0 <= j && j <= 2 && this.board[i][j] != 'X' && this.board[i][j] != 'O';
	}

	playTurn(i,j){
		if(this.isValid(i,j)){
			if(this.turn){
				this.board[i][j] = 'X';
			}
			else{
				this.board[i][j] = 'O';
			}
			this.turn = !this.turn;
			return;
		}
		console.log("BAD INPUT");
	}

	printBoard(){
		for(let i = 0; i < this.board.length; i++){
			for(let j = 0; j < this.board[i].length; j++){
				let symbol;
				symbol = this.board[i][j];
				if(this.board[i][j] != 'X' && this.board[i][j] != 'O'){
					symbol = " ";
				}

				if(j != 2){
					process.stdout.write(`  ${symbol}  |`);
				}
				else{
					process.stdout.write(`  ${symbol}  `);
				}
			}
			process.stdout.write("\n");
			if(i != 2){
				process.stdout.write("------------------\n");
			}
		}
		console.log("\n\n");
	}

	finalGameResult(){
		if(this.tie()){
			return "TIE!";
		}

		if(this.turn){
			return "O wins"
		}
		else{
			return "X wins";
		}
		
	}
}


class TicTacToeView{
	constructor(width = window.innerHeight, height = window.innerHeight){
		this.canvas = document.getElementById("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = canvas.getContext("2d");
	}

	drawResult(result){
		this.ctx.fillStyle = "purple";
		this.ctx.font = "70px Arial";
		this.ctx.fillText(result, 100, 100);

	}

	drawGrid(){
		this.ctx.strokeStyle = "green";
		let gridWidth = this.canvas.width/3;
		let gridHeight = this.canvas.height/3;
		this.ctx.beginPath();
		this.ctx.moveTo(gridWidth,0);
		this.ctx.lineTo(gridWidth, this.canvas.height);
		this.ctx.stroke();

		//right vertical line
		this.ctx.beginPath();
		this.ctx.moveTo(gridWidth * 2,0);
		this.ctx.lineTo(gridWidth * 2, this.canvas.height);
		this.ctx.stroke();

		//top horizontal line
		this.ctx.beginPath();
		this.ctx.moveTo(0, gridHeight);
		this.ctx.lineTo(this.canvas.width, gridHeight);
		this.ctx.stroke();

		//bottom horizontal line
		this.ctx.beginPath();
		this.ctx.moveTo(0, gridHeight * 2);
		this.ctx.lineTo(this.canvas.width, gridHeight * 2);
		this.ctx.stroke();
	}

	drawBoard(board){
		this.clear();
		for(let i = 0; i < board.length; i++){
			for(let j = 0; j < board.length; j++){
				this.drawShape(i,j,board[i][j]);
			}
		}
	}

	drawX(i,j){
		this.ctx.strokeStyle = "red";
		let gridWidth = this.canvas.width/3;
		let gridHeight = this.canvas.height/3;

		//top left to bottom right diagonal
		this.ctx.beginPath();
		this.ctx.moveTo(gridWidth * j, gridHeight * i);
		this.ctx.lineTo(gridWidth * (j + 1), gridHeight * (i + 1));
		this.ctx.stroke();

		//top right to bottom left diagonal
		this.ctx.beginPath();
		this.ctx.moveTo(gridWidth * (j + 1), gridHeight * i);
		this.ctx.lineTo(gridWidth * j, gridHeight * (i + 1));
		this.ctx.stroke();

	}

	drawO(i,j){
		this.ctx.strokeStyle = "blue";
		let gridWidth = this.canvas.width/3;
		let gridHeight = this.canvas.height/3;
		let radius = gridWidth/2;
		this.ctx.beginPath();
		this.ctx.arc(j * gridWidth + radius, gridHeight * i + radius, radius, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	drawShape(i,j,shape){
		if(shape == 'X'){
				this.drawX(i,j);
		}
		
		if(shape == 'O'){
			this.drawO(i,j);
		}
		
	}

	clear(){
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height); //erases board view for redraw
		this.drawGrid();
	}
}








window.addEventListener("load",main);