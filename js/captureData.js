
let original, display, cO, cD, w, h, video, u, x, y, status, label;

function createCanvas(w,h){
	let canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return canvas;
}

function init(){
	x = [];
	y = [];
	original = createCanvas(320,240);
	cO = original.getContext('2d', {alpha: false});
	display = createCanvas(320,240);
	cD = display.getContext('2d', {alpha: false});
	let left = document.getElementById("left");
	
	let right = document.getElementById("right");
	
	left.appendChild( original );
	
	right.appendChild( display );
	
	status = document.createElement('div');
	status.style.width = "316px";
	status.style.height = "30px";
	status.style.textAlign = "center";
	status.innerHTML = " ";
	right.appendChild( status );

	labelInput = document.createElement('input');
	labelInput.type = "text";
	labelInput.style.width = "316px";
	labelInput.style.height = "30px";
	labelInput.style.textAlign = "center";
	labelInput.placeholder = "label";
	left.appendChild( labelInput );

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
		u = requestAnimationFrame(update);
	}
}

function addData(){
	let label;
	try{
		label = JSON.parse(labelInput.value);
	}catch(e){
		console.error( e.message );
		status.innerHTML = "Use [0,1,0] format on label input";
		return;
	}
	let newImg = new Image();
	newImg.src = display.toDataURL();
	newImg.onload = function(){
		let tmpCanvas = createCanvas(32,24);
		cT = tmpCanvas.getContext('2d', {alpha: false});
		cT.drawImage(newImg,0,0,32,24);
		let img = cT.getImageData(0,0,32,24);
		img = gaussianBlur(img);
		let finalData = Array(32*24);
		
		for(let i = 0; i < finalData.length; i++){
			finalData[i] = img.data[ i * 4 ];
		}
		switch(label){
			case 0 :
					label = [1,0];
				break;
			case 1 :
					label = [0,1];
				break;
			case 3 :
					label = [0,0,1];
				break;
		}
		x.push( finalData );
		y.push( label );
		status.innerHTML = "Size: "+x.length+" - "+label.join(',');
	}	
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

function capture(label){
	let img = cO.getImageData(0,0,320,240);
	img = rgb2gray(img);
	img = gaussianBlur(img);
	cD.putImageData(img,0,0);
	addData(label);
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

function download(value,filename){
	let blob = new Blob([JSON.stringify(value)], {type: 'text/json'});
	let link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = filename;
	link.click();
}

function undo(){
	x.pop();
	y.pop();
	status.innerHTML = "Size: "+x.length+" - Last entry deleted";
}

function save(){
	download(x,'x.json');
	download(y,'y.json');
}

init();

document.body.addEventListener("keydown",function(e){
	switch(e.keyCode){
		case 67 :
				capture();
			break;
		case 83 :
				save();
			break;
		case 85 :
				undo();
			break;	
	}
});
