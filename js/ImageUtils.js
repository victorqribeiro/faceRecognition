class ImageUtils {

	static gaussianBlur(img){
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

	static rgb2gray(img){
		for(let i = 0; i < img.data.length; i+=4){
			let v = (img.data[i] * 0.2126) + (img.data[i+1] * 0.7152) + (img.data[i+2] * 0.0722);
			img.data[i] = v;
			img.data[i+1] = v;
			img.data[i+2] = v;
		}
		return img;
	}

	static draw(x){
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

}
