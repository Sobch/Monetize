/* ################### */
/* #### VARIABLES #### */
/* ################### */


// Drawing from right side of moneySpace element.
let drawFromRightSide = true; // drawing from right side of moneySpace element.

// Rounds values close to upper bound, for example 9.99 to 10.
let roundingUp = true;
	// Lower value in percent for rounding,
	// it works when value doesn't reach rounding target,
	//  e. g. 9.99->10, 99.90->100
	let roundUpLowerValue = 0.99;
	// Higher value in percent for rounding,
	// it works when value is higher than rounding target,
	//  e. g. 19.50->20, 295->300
	let roundUpHigherValue = 0.95;

// Enables drawing animation (requires jQuery)
let animationEnabled = true;

	// Animation interval
	let animationInterval = 300;
	
	
/* ################### */
/* ################### */
/* ################### */


function monetizeRedraw(value, moneySpaceObject){
		
	let roundUp = function(value, step, lowerValue, higherValue) {
		if (
			(value % step >= lowerValue * step) ||
			(value % step >= higherValue * step && value > step)
		){
			value += step - (value % step) + 0.0001;
		}
		return value;
	}
	let drawCoin = function(xPos, yPos, coin, drawFromRightSide, zindex = 0){
		drawFromRightSide ? 
				moneySpaceObject.innerHTML +=  
				'<div class="Monetize coin coin-' + coin + '" style="right: ' + xPos + 'px; bottom: ' + yPos + 'px; z-index: ' + zindex + ';"></div>'
			: 	moneySpaceObject.innerHTML +=  
				'<div class="Monetize coin coin-' + coin + '" style="left: ' + xPos + 'px; bottom: ' + yPos + 'px; z-index: ' + zindex + ';"></div>';
	}
		
	let remnant = parseFloat(value) + 0.0001;
	let xPos = 0;
	let yPos = 4;
	let xCoinsPos = 0;
	
	if (roundingUp) {
		remnant = roundUp(remnant, 1, roundUpLowerValue, roundUpHigherValue);
		remnant = roundUp(remnant, 10, roundUpLowerValue, roundUpHigherValue);
		remnant = roundUp(remnant, 100, roundUpLowerValue, roundUpHigherValue);
		remnant = roundUp(remnant, 1000, roundUpLowerValue, roundUpHigherValue);
	}
	
	if (remnant > 10000) remnant = 10000; // including only values to 10000!
	let x1000 = Math.floor(remnant / 1000);
	remnant %= 1000;
	let x100 = Math.floor(remnant / 100);
	remnant %= 100;
	let x10 = Math.floor(remnant / 10);
	remnant %= 10;
	let x1 = Math.floor(remnant);
	remnant %= 1;
	let x01 = Math.floor(remnant / 0.1);
	remnant %= 0.1;
	let x001 = Math.round(remnant / 0.01);
	remnant %= 0.01;
	
	moneySpaceObject.innerHTML = "";
	
//// 1k drawing
	for (let i = 0; i < x1000; i++){ 
		drawCoin(xPos, yPos, "1000", drawFromRightSide);
		xPos += 11;
	}
	
//// 100 drawing
	if (x1000 && x100) xPos+=21;
	yPos += 6;
	for (let i = 0; i < x100; i++){ 
		drawCoin(xPos, yPos, "100", drawFromRightSide);
		xPos += 9;
	}
	
	
//// 10 drawing
	if (x1000 || x100) xPos+=20;
	else if (x1 <= 5) yPos = 0;
	if ((x1000?1:0)+(x100?1:0)+(x10?1:0) <= 1) xCoinsPos = 0;
	else xCoinsPos = xPos + 16;
	yPos += 6;
	for (let i = 0; i < x10; i++){ 
		drawCoin(xPos, yPos, "10", drawFromRightSide);
		xPos += 8;
	}
	
////  1 drawing
	yPos = 0;
	xPos = xCoinsPos;
	for (let i = 0; i < x1 && i < 5; i++){ 
		drawCoin(xPos, yPos, "1", drawFromRightSide, 10);
		yPos += 4;
	}
	
	if (x1 > 5) {
		xPos+=12;
		yPos = 6;
		for (let i = 5; i < x1; i++){ 
			drawCoin(xPos, yPos, "1", drawFromRightSide, 9);
			yPos += 4;
		}
	}

//// 0.1 drawing
	if (x1) xPos+=15;
	yPos = 0;
	for (let i = 0; i < x01 && i < 5; i++){ 
		drawCoin(xPos, yPos, "01", drawFromRightSide, 10);
		yPos += 3;
	}
	if (x01 > 5) {
		yPos = 4;
		xPos+=7;
		for (let i = 5; i < x01; i++){ 
			drawCoin(xPos, yPos, "01", drawFromRightSide, 9);
			yPos += 3;
		}
	}
	
//// 0.01 drawing
	yPos = 0;
	if (x01 > 0) {xPos += 7;}
	for (let i = 0; i < x001 && i < 5; i++){ 
		drawCoin(xPos, yPos, "001", drawFromRightSide, 10);
		yPos += 2;
	}
	if (x001 > 5) {
		yPos = 2;
		xPos+=6;
		for (let i = 5; i < x001; i++){ 
			drawCoin(xPos, yPos, "001", drawFromRightSide, 9);
			yPos += 2;
		}
	}
	xPos+=25;


	if (animationEnabled) {

		let interval = animationInterval;

		let currentElement = $('.Monetize.moneySpace .Monetize.coin').first();
		let bottom = parseInt($(currentElement).css("bottom"));

		$('.Monetize.moneySpace .Monetize.coin').each(function(){
			$(this).css("bottom", parseInt($(this).css("bottom"))+26).css("opacity",0);
		});
		
		$(currentElement).css("bottom",bottom+26).animate({"opacity":1, "bottom":bottom+12}, {easing: "linear", duration: interval/2, complete: function(){
			next();
		}});
		$(currentElement).css("bottom",bottom+26).animate({"opacity":1, "bottom":bottom},{easing: "linear", duration: interval/2});

		function next(){
			currentElement = $(currentElement).next();
			bottom = parseInt($(currentElement).css("bottom"));
			interval -= interval / 30;
			$(currentElement).animate({"opacity":1, "bottom":bottom-13},{easing: "linear", duration: interval/2, complete: function(){
				next();
			}});
			$(currentElement).animate({"opacity":1, "bottom":bottom-26},{easing: "linear", duration: interval/2});
		}
	}
}
