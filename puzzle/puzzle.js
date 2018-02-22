function randomimage(){
	var type = document.getElementById("imageType").src;
	var rand = "pos"
	var num;
	var put_black;
	randoms = [];
	for(i=1; i<10; i++){
		rand = "pos" + i;
		num = getRandomInt(1, 9);
		while (randoms.includes(num)){
			num = getRandomInt(1, 9);
		}
		randoms.push(num);
		if (num == 9) {
			put_black = true;
		}
		if (put_black){
			document.getElementById(rand).src = "black.jpg";
			put_black = false;
		}else{
			document.getElementById(rand).src = folder + num + ".jpg"};
	}
}
