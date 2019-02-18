let x, y, n, nn;

async function train(){
	let xR = await fetch('data/x.json');
	let _x = await xR.json();
	let xY = await fetch('data/y.json');
	let _y = await xY.json();

	x = _x;
	y = _y;

	init();
}

train();

function init(){
	
	nn = new MLP( x[0].length, x[0].length * 2, 2, 0.005, 1 );
	
	nn.fit( x, y );
	
	nn.save();
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

