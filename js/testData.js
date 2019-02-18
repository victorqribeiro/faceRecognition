
let original, cO, video, u, finalData, n, nn, div;

async function train(){
	let nR = await fetch('data/nn.json');
	let _n = await nR.json();
	n = _n;
	init();
}

train();

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
	img = rgb2gray(img);
	let tempCanv = createCanvas(320,240);
	let cT = tempCanv.getContext('2d', {alpha: false});
	cT.putImageData(img,0,0);
	let newImg = new Image();
	newImg.src = tempCanv.toDataURL();
	newImg.onload = function(){
		let tmpCanvas = createCanvas(32,24);
		cT = tmpCanvas.getContext('2d', {alpha: false});
		cT.drawImage(newImg,0,0,32,24);
		//div.innerHTML = "";
		//div.appendChild( tmpCanvas );
		let img = cT.getImageData(0,0,32,24);
		img = gaussianBlur(img);
		finalData = Array(32*24);
		for(let i = 0; i < finalData.length; i++){
			finalData[i] = img.data[ i * 4 ];
		}
	}	
}

function gaussianBlur(img){
	let kernel = [	
		0.003765,	0.015019,	0.023792,	0.015019,	0.003765,
		0.015019,	0.059912,	0.094907,	0.059912,	0.015019,
		0.023792,	0.094907,	0.150342,	0.094907,	0.023792,
		0.015019,	0.059912,	0.094907,	0.059912,	0.015019,
		0.003765,	0.015019,	0.023792,	0.015019,	0.003765
	];
	let blurredImg = new ImageData(img.data, img.width, img.height);
	for(let i = 2; i < img.height-2; i++){
		for(let j = 2; j < img.width-2; j++){
			let sum = 0;
			for(let y = -2; y < 3; y++){
				for(let x = -2; x < 3; x++){
					sum += img.data[((i+y)*4)*img.width+((j+x)*4)] * kernel[ (y+2) * 5 + (x+2) ];
				}
			}
			blurredImg.data[ (i * img.width + j) * 4 ] = sum;
			blurredImg.data[ ((i * img.width + j) * 4) + 1] = sum;
			blurredImg.data[ ((i * img.width + j) * 4) + 2 ] = sum;
			blurredImg.data[ ((i * img.width + j) * 4) + 3 ] = 255; //this almost made my loose my mind. ask my why if you get the chance.
		}
	}
	return blurredImg;
}

function rgb2gray(img){
	for(let i = 0; i < img.data.length; i+=4){
		let v = (img.data[i] * 0.2126) + (img.data[i+1] * 0.7152) + (img.data[i+2] * 0.0722);
		img.data[i] = v;
		img.data[i+1] = v;
		img.data[i+2] = v;
	}
	return img;
}

function draw(x){
	let canvas = document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 24;
	let c = canvas.getContext('2d');
	for(let i = 0; i < 32; i++){
		for(let j = 0; j < 24; j++){
			let p = x[ j * 32 + i	 ];
			c.fillStyle = "rgb("+p+","+p+","+p+")";
			c.fillRect(i,j,1,1);
		}
	}
	document.body.appendChild( canvas );
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
