function getValues(){
	carousel();
	folder = document.getElementById("imageType").src.split("/");
	folder = folder[folder.length-1].split(".")[0]
	winning = [folder + "1", folder + "2", folder + "3", folder + "4", folder + "5",
						 folder + "6", folder + "7", folder + "8", "black"];
	randomimage();
	for(i=1; i<10; i++){
		pos = "pos" + i;
		img = document.getElementById(pos);
		images.push(img.src);
	};
	carouselInterval = setInterval(carousel, 8000); // Change image every 8 seconds
	countingInterval = setInterval(start_counting, 1000);
	document.addEventListener("keydown", show ,false);
};

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
