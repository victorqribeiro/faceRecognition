let x, y, n, nn;

async function train(){
	let xR = await fetch('data/bode/x.json');
	let _x = await xR.json();
	let xY = await fetch('data/bode/y.json');
	let _y = await xY.json();

	x = _x;
	y = _y;

	init();
}

train();

function init(){
	
	nn = new MLP( x[0].length, x[0].length * 2, y[0].length, 0.005, 5000 );
	
	nn.fit( x, y );
	
	nn.save();
}
