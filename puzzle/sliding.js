var canvas = document.getElementById('puzzle');
var context = canvas.getContext('2d');

var myIndex1 = 0;
var myIndex2 = 0;
var myIndex3 = 0;
var highscore;
var player;
var img;

var totaltime = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var countingInterval;
var carouselInterval;

var pieceWidth;
var pieceHeight;
var tileCount = 3; //dificultad
var puzzleWidth;
var puzzleHeight;

var solved = false;
var boardParts;

var clickLoc = new Object; //la pieza vacía
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object; //la pieza que clicas con el raton
emptyLoc.x = 0;
emptyLoc.y = 0;

function init(src){
  img = new Image();
  img.src = src + '.jpg';
  img.addEventListener('load', onImage, false);
  getValues();
  setBoard();
  drawTiles();
}

function onImage(e){
  pieceWidth = Math.floor(img.width / tileCount)
  pieceHeight = Math.floor(img.height / tileCount)
  puzzleWidth = pieceWidth * tileCount;
  puzzleHeight = pieceHeight * tileCount;
  canvas.width = puzzleWidth;
  canvas.height = puzzleHeight;
  canvas.style.border = "1px solid black";
  drawTiles();
}

function getValues(){
	carousel();

	carouselInterval = setInterval(carousel, 8000); // Change image every 8 seconds
	countingInterval = setInterval(start_counting, 1000);

};

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

function displayID(clicked){

  var change = clicked.src.split("/");
	change = change[change.length-1].split(".")[0];
  init(change);
  clicked.src = document.getElementById("imageType").src;
	document.getElementById("imageType").src = change + ".jpg";
  clearInterval(countingInterval); // para iniciar mi contador de nuevo
	clearInterval(carouselInterval); // para iniciar mi slider
	seconds = 0;
	hours = 0;
	minutes = 0;
  getValues();
}

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



document.getElementById('puzzle').onclick = function(e) {
  //this.offsetLeft ES DONDE ESÁ COLOCADO A LA DERECHA
  //this.offsetTop ES DONDE ESTÁ COLOCADO HACIA ABAJO
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / pieceWidth);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / pieceHeight);
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  if (solved) {
    setTimeout(gameWin,500);
    highscore = String(hours) + ":" + String(minutes) + ":" + String(seconds);
    totaltime = 3600*hours + 60*minutes + seconds;
    var win = document.createElement("img");
    win.src = "winner.gif";
    win.id = "winner";
    win.width = window.innerWidth;
    win.height = window.innerHeight;
    win.setAttribute("onclick", "hideimage()");
    document.getElementById("slider").appendChild(win);
  }
};

function setBoard() {
  boardParts = new Array(tileCount);
  for (var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for (var j = 0; j < tileCount; ++j) {
      boardParts[i][j] = new Object;
      boardParts[i][j].x = (tileCount - 1) - i;
      boardParts[i][j].y = (tileCount - 1) - j;
    }
  }
  emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
  emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
  solved = false;
}

function drawTiles() {
  context.clearRect ( 0 , 0 , puzzleWidth , puzzleHeight );
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
        context.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight,
            i * pieceWidth, j * pieceHeight, pieceWidth, pieceHeight);
      }
    }
  }
}

function slideTile(toLoc, fromLoc) {
  if (!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    checkSolved();
  }
}

function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function hideimage(){
  document.getElementById("slider").removeChild(document.getElementById("winner"));
  var nickname = prompt("New Highscore! Write your name", "Your Name");
  console.log(nickname);
  if (nickname != "" && nickname != null) {
    player = nickname;
  } else {
    player = "no name (write yours the next time)";
  };
  equatecookie();
  console.log("he entrado");
  clearInterval(countingInterval); // para iniciar mi contador de nuevo
  seconds = 0;
  hours = 0;
  minutes = 0;
  getValues();
}

function equatecookie(){
  console.log("entro");
  console.log(document.cookie);
  cookie = document.cookie;
  if (cookie){
    name = cookie.split("=")[1].split(" ")[0];
    second = parseInt(cookie.split("=")[1].split(" ")[2]);
  }else{
    second = 0;
  }
  if (second > totaltime || cookie=== ""){
    if (name === player){
      alert("PUTA! QUÉ OFERTÓN!!");
    }
    cadena = "username= " + player + " " + highscore + " " + String(totaltime);
    document.cookie = cadena;
    console.log(document.cookie);
  }
}

function gameWin(){
  setBoard();
  drawTiles();
}

function showhighscore(){
  cookie = document.cookie;
  name = cookie.split("=")[1].split(" ")[0];
  second = cookie.split("=")[1].split(" ")[1];

  if (name == undefined){
    alert("No one has played yet!\n Try your best NOW");
  }else{
    alert("THE BEST PLAYER IS:\n\n" + name + "\nFinished in: " + second);
  }
}
