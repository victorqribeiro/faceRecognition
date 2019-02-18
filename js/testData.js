
let original, cO, video, u, finalData, n, nn, div;

async function load(){
	let nR = await fetch('data/nn.json');
	let _n = await nR.json();
	n = _n;
	init();
}

load();

function createCanvas(w,h){
	let canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return canvas;
}

function init(){

	nn = new MLP();

	nn.load( n );

	original = createCanvas(320,240);
	cO = original.getContext('2d', {alpha: false});

	let left = document.getElementById("left");
	
	let right = document.getElementById("right");
	
	div = document.createElement("div");
	div.id = "result";
	
	right.appendChild( div );
	
	left.appendChild( original );
	
	getVideo();
}

function getVideo(){
	navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 320, height: 240 } })
	.then(function(stream){
		video = document.createElement('video');
		video.srcObject = stream;
		video.onloadedmetadata = function(e){
			video.play();
			update();
		}
	})
	.catch(function(err){ console.error(err); });
}

function update(){
	if(video){
		cO.drawImage(video,0,0,320,240);
		imgAsArray();
		if( finalData ){
			let result = nn.predict( finalData ).data;
			let r = -Infinity;
			let index = -1;
			for(let i = 0; i < result.length; i++){
				if( result[i] > r ){
					r = result[i]
					index = i;
				}
			}
			div.innerHTML = index;
		}
		u = requestAnimationFrame(update);
	}
}


function imgAsArray(){
	let img = cO.getImageData(0,0,320,240);
	img = ImageUtils.rgb2gray(img);
	let tempCanv = createCanvas(320,240);
	let cT = tempCanv.getContext('2d', {alpha: false});
	cT.putImageData(img,0,0);
	let newImg = new Image();
	newImg.src = tempCanv.toDataURL();
	newImg.onload = function(){
		let tmpCanvas = createCanvas(32,24);
		cT = tmpCanvas.getContext('2d', {alpha: false});
		cT.drawImage(newImg,0,0,32,24);
		let img = cT.getImageData(0,0,32,24);
		img = ImageUtils.gaussianBlur(img);
		finalData = Array(32*24);
		for(let i = 0; i < finalData.length; i++){
			finalData[i] = img.data[ i * 4 ];
		}
	}	
}

document.body.addEventListener("keydown",function(e){
	switch(e.keyCode){
		case 96 :
				capture(0);
			break;
		case 97 :
				capture(1);
			break;
		case 99 :
				capture(3);
			break;
		case 83 :
				save();
			break;	
	}
});
