const PUZZLE_DIFFICULTY = 3;
//const PUZZLE_HOVER_TINT = '#009900';

var _canvas;
var _stage;

var canvx = 500;
var canvy = 210;

var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;

var images = [];
var randoms = [];
var folder;
var winning = [];
var seconds = 0;
var minutes = 0;
var hours = 0;
var countingInterval;
var carouselInterval;

var myIndex1 = 0;
var myIndex2 = 0;
var myIndex3 = 0;
var highscore;
var player;

//cargar imagen
function init(src){
  _img = new Image();
  _img.addEventListener('load',onImage,false);
  _img.src = src + ".jpg";
  getValues();
}

function carousel() {
    var i;
		var x = document.getElementsByClassName("slide1");
		for(i=0; i<x.length; i++) {
				x[i].style.display = "none";
		}
		myIndex1++;
		if (myIndex1 > x.length) {myIndex1 = 1};
		x[myIndex1-1].style.display = "inline";


		x = document.getElementsByClassName("slide2");
		for(i=0; i<x.length; i++) {
				x[i].style.display = "none";
		}
		myIndex2++;
		if (myIndex2 > x.length) {myIndex2 = 1};
		x[myIndex2-1].style.display = "inline";


		x = document.getElementsByClassName("slide3");
		for(i=0; i<x.length; i++) {
				x[i].style.display = "none";
		}
		myIndex3++;
		if (myIndex3 > x.length) {myIndex3 = 1};
		x[myIndex2-1].style.display = "inline";
};

// Contador para mi pagina
function start_counting(){
	var counter = hours + ":" + minutes + ":" + seconds;
	seconds += 1;
	if (seconds == 60) {
		minutes += 1;
		seconds = 0;
		if (minutes == 60){
			hours += 1;
			minutes = 0;
		}
	}
	document.getElementById("counter").innerHTML = counter;
};
function getValues(){
	carousel();

	carouselInterval = setInterval(carousel, 8000); // Change image every 8 seconds
	countingInterval = setInterval(start_counting, 1000);
	//document.addEventListener("keydown", show ,false);
};

// Para seleccionar la imagen de mi slider.
function displayID(clicked){

  var change = clicked.src.split("/");
	change = change[change.length-1].split(".")[0];
  init(change);
  clicked.src = document.getElementById("imageType").src;
	document.getElementById("imageType").src = change + ".jpg";
  images = [];
	clearInterval(countingInterval); // para iniciar mi contador de nuevo
	clearInterval(carouselInterval); // para iniciar mi slider
	seconds = 0;
	hours = 0;
	minutes = 0;
  getValues();
}

//calcular dimensiones puzzle según las dificultades
function onImage(e){
  _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY)
  _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY)
  _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
  _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
  setCanvas();
  initPuzzle();
}

//Crea el canvas con las dimensiones de la imagen
function setCanvas(){
  _canvas = document.getElementById('canvas');
  _stage = _canvas.getContext('2d');
  _canvas.width = _puzzleWidth;
  _canvas.height = _puzzleHeight;
  _canvas.style.border = "1px solid black";
}

//Array con piezas, posicion del ratón y piezas
function initPuzzle(){
  _pieces = [];
  _mouse = {x:0,y:0};
  _currentPiece = null;
  _currentDropPiece = null;
  //para que te lo dibuje primero bien: _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
  //createTitle("Click to Start Puzzle");
  buildPieces();
}

//pone el click de abajo que no necesitamos
/*function createTitle(msg){
  _stage.fillStyle = "#000000";
  _stage.globalAlpha = .4;
  _stage.fillRect(100,_puzzleHeight - 40,_puzzleWidth - 200,40);
  _stage.fillStyle = "#FFFFFF";
  _stage.globalAlpha = 1;
  _stage.textAlign = "center";
  _stage.textBaseline = "middle";
  _stage.font = "20px Arial";
  _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
}*/

//Guardar en el array _pieces las corrdenadas de cada piezas
//hago un objeto para cada pieza y guardo coord. x e y
function buildPieces(){
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for(i = 0;i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;i++){
      piece = {};
      piece.sx = xPos;
      piece.sy = yPos;
      _pieces.push(piece);
      xPos += _pieceWidth;
      if(xPos >= _puzzleWidth){
          xPos = 0;
          yPos += _pieceHeight;
      }
  }
  //document.onmousedown = shufflePuzzle; quitaaaado
  shufflePuzzle();//añadido
}

//Desordena las piezas en el array, limpia el canvas
//y las redibuja desordenadas
function shufflePuzzle(){
  _pieces = shuffleArray(_pieces);
  //_stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for(i = 0;i < _pieces.length;i++){
      piece = _pieces[i];
      piece.xPos = xPos;
      piece.yPos = yPos;
      _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
      _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
      xPos += _pieceWidth;
      if(xPos >= _puzzleWidth){
          xPos = 0;
          yPos += _pieceHeight;
      }
  }
  document.onmousedown = onPuzzleClick;
}

//desordena las piezas del array
function shuffleArray(o){
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

//coge la posicion del raton y mira si hay una pieza
//si la hay, checkpieceClicked la adjunta al mouse
function onPuzzleClick(e){
  if(e.layerX || e.layerX == 0){
      _mouse.x = e.layerX - _canvas.offsetLeft + canvx;
      _mouse.y = e.layerY - _canvas.offsetTop + canvy;
  }
  else if(e.offsetX || e.offsetX == 0){
      _mouse.x = e.offsetX - _canvas.offsetLeft + canvx;
      _mouse.y = e.offsetY - _canvas.offsetTop + canvy;
  }
  _currentPiece = checkPieceClicked(e);
  if(_currentPiece != null){
      _stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
      _stage.save();//difumina la imagen que coges y guarda el lienzo sin ella
      _stage.globalAlpha = .9;
      //te dibuja la imagen en el centro del puntero
      _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
      _stage.restore();//reestablecer el valor alfa
      document.onmousemove = updatePuzzle;
      document.onmouseup = pieceDropped;

  }
}

function checkPieceClicked(e){
  var i;
  var piece;
  if((e.pageX > canvx && e.pageX < (canvx + _puzzleWidth)) && (e.pageY >  canvy && e.pageY < (canvy + _puzzleHeight))){
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x > piece.xPos && _mouse.x < (piece.xPos + _pieceWidth) && _mouse.y > piece.yPos && _mouse.y < (piece.yPos + _pieceHeight)){
            return piece;
        }
    }
  }
  return null;
}

function updatePuzzle(e){
  _currentDropPiece = null;
  if(e.layerX || e.layerX == 0){
      _mouse.x = e.layerX - _canvas.offsetLeft + canvx;
      _mouse.y = e.layerY - _canvas.offsetTop + canvy;
  }
  else if(e.offsetX || e.offsetX == 0){
      _mouse.x = e.offsetX - _canvas.offsetLeft + canvx;
      _mouse.y = e.offsetY - _canvas.offsetTop + canvy;
  }
  _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
  var i;
  var piece;
  for(i = 0;i < _pieces.length;i++){
      piece = _pieces[i];
      if(piece == _currentPiece){
          continue;
      }
      _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
      _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
      if(_currentDropPiece == null){
          if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
              //NOT OVER
          }
          else{
              _currentDropPiece = piece;
              _stage.save();
              _stage.globalAlpha = .4;
              //_stage.fillStyle = PUZZLE_HOVER_TINT;
              _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
              _stage.restore();
          }
      }
  }
  _stage.save();
  _stage.globalAlpha = .6;
  _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
  _stage.restore();
  _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

function pieceDropped(e){
  document.onmousemove = null;
  document.onmouseup = null;
  if(_currentDropPiece != null){
      var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
      _currentPiece.xPos = _currentDropPiece.xPos;
      _currentPiece.yPos = _currentDropPiece.yPos;
      _currentDropPiece.xPos = tmp.xPos;
      _currentDropPiece.yPos = tmp.yPos;
  }

  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
  _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
  var gameWin = true;
  var i;
  var piece;
  for(i = 0;i < _pieces.length;i++){
      piece = _pieces[i];
      _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
      _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
      if(piece.xPos != piece.sx || piece.yPos != piece.sy){
          gameWin = false;
      }
  }

  if(gameWin){
      setTimeout(gameOver,500);
      highscore = String(hours) + ":" + String(minutes) + ":" + String(seconds);
      var win = document.createElement("img");
    	win.src = "winner.gif";
  		win.id = "winner";
  		win.width = window.innerWidth;
  		win.height = window.innerHeight;
      //hideimage();
  		win.setAttribute("onclick", "hideimage()");
  		document.getElementById("slider").appendChild(win);




  }
}


  function hideimage(){
    document.getElementById("slider").removeChild(document.getElementById("winner"));
    // hay que hacerlo condicional por si se supera el highscore
    var nickname = prompt("New Highscore! Write your name", "Your Name");
    if (nickname != "" && nickname != null) {
      player = nickname;
    } else {
      player = "no name (write yours the next time)";
    };
    // hay que hacerlo condicional por si se supera el highscore
    images = [];
    clearInterval(countingInterval); // para iniciar mi contador de nuevo
    seconds = 0;
    hours = 0;
    minutes = 0;
    getValues();
  }
//La imagen original es la sx, sy
//Las coordenadas actuales son las xPos, yPos


function gameOver(){
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;
  initPuzzle();
}

function showhighscore(){
	if (player == undefined){
		alert("No one has played yet!\n Try your best NOW");
	}else{
		alert("THE BEST PLAYER IS:\n\n" + player + "\nFinished in: " + highscore);
	}
}
