
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
	}
	if( !(label instanceof Array) ){
		status.innerHTML = "Use [0,1,0] format on label input";
		return
	}
	let newImg = new Image();
	newImg.src = display.toDataURL();
	newImg.onload = function(){
		let tmpCanvas = createCanvas(32,24);
		cT = tmpCanvas.getContext('2d', {alpha: false});
		cT.drawImage(newImg,0,0,32,24);
		let img = cT.getImageData(0,0,32,24);
		img = ImageUtils.gaussianBlur(img); // don't blurr in the preview image, just here
		let finalData = Array(32*24);
		
		for(let i = 0; i < finalData.length; i++){
			finalData[i] = img.data[ i * 4 ];
		}

		x.push( finalData );
		y.push( label );
		status.innerHTML = "Size: "+x.length+" - "+label.join(',');
	}	
}

function capture(label){
	let img = cO.getImageData(0,0,320,240);
	img = ImageUtils.rgb2gray(img);
	//img = ImageUtils.gaussianBlur(img); // Only blurring the sacale down image, on the addData function
	cD.putImageData(img,0,0);
	addData(label);
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
