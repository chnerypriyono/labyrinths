class Timer {

    constructor(displayArea) {
        this.minutes        = 0;
        this.seconds        = 0;
        this.centiseconds   = 0;
        this.timerHandler   = null;
        this.displayArea    = displayArea;       
    }

    start() {

    	var _this = this

    	reset();

        this.timerHandler = setInterval(function () {        	
            display();
            increment();          
        }, 10);          

        function increment () {        
            _this.centiseconds++;
            if (_this.centiseconds > 99) {
                _this.centiseconds = 0;
                _this.seconds++;
                if (_this.seconds > 59) {
                    _this.seconds = 0;
                    _this.minutes++;
                    if (_this.minutes > 59) {
                        clearInterval(_this.timerHandler);
                    }
                }
            }
        }

        function display() {        	
            _this.displayArea.innerHTML = format(_this.minutes) + ':' + format(_this.seconds) + ":" + format(_this.centiseconds)

            function format(number) {
                if (number < 10) {
                    return '0' + number;
                } else {
                    return number;
                }
            }
        };      

        function reset() {
        	_this.minutes        = 0;
	        _this.seconds        = 0;
	        _this.centiseconds   = 0;
        }
    }

    stop() {
        clearInterval(this.timerHandler)
    }
}


const TYPE_WAY = 1
const TYPE_WALL = 2
const TYPE_START = 3
const TYPE_FINISH = 4
const TYPE_TRAIL = 5

const canvas = document.getElementById("playArea");
const timerDisplay = document.getElementById("timerDisplay");
const ctx = canvas.getContext("2d", { willReadFrequently: true } );

var viewportOffset = canvas.getBoundingClientRect();
// these are relative to the viewport, i.e. the window
var canvasTop = viewportOffset.top;
var canvasLeft = viewportOffset.left;

const img = new Image()
img.crossOrigin = "Anonymous"
//img.src = 'https://i.ibb.co/0hLRybY/Screenshot-2024-02-20-at-21-23-02.png'
img.src = 'https://i.ibb.co/Xfnc3gs/Screenshot-2024-02-20-at-21-23-02-copy.png'
img.onload = function() {
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

const timer = new Timer(timerDisplay);

let currentX = -1
let currentY = -1


canvas.ontouchstart = function(event) {
	//console.log("ontouchstart")
	handleDown(event.touches[0].clientX - canvasLeft, event.touches[0].clientY - canvasTop)
}

canvas.ontouchmove = function(event) {
	//console.log("ontouchmove")
	handleMove(event.touches[0].clientX - canvasLeft, event.touches[0].clientY - canvasTop)
}

canvas.ontouchend = function(event) {
	//console.log("ontouchend")
	handleUp()
}

canvas.onmousedown = function(event) {
	//console.log("on mouse down")
	handleDown(event.offsetX, event.offsetY)
}

canvas.onmousemove = function(event) {
	// console.log(event.offsetX, event.offsetY)
	// let colorAtCoord = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data
	// console.log(colorAtCoord)
	handleMove(event.offsetX, event.offsetY)
}

canvas.onmouseup = function(event) {
	//console.log("on mouse up")
	handleUp()
}

function handleDown(x, y) {
	//console.log(getTypeAtCoord(x, y))
	if (getTypeAtCoord(x, y) === TYPE_START) {
		//console.log("start")
		timer.start()
		currentX = event.offsetX
		currentY = event.offsetY
	}
}

function handleMove(x, y) {
	if (x <= 0) x = 0
	if (y <= 0) y = 0
	//console.log(x, y)
	
	let typeAtCoord = getTypeAtCoord(x, y)

	if (isHittingWall(typeAtCoord)) {
		gameOver()
	}

	if (isPlayStarted()) {
		ctx.beginPath()
		ctx.moveTo(currentX, currentY)
		ctx.lineTo(x, y)
		ctx.strokeStyle = "#0000FF"
		ctx.stroke()
		currentX = x 
		currentY = y
		
		if (typeAtCoord === TYPE_FINISH) {
			gameFinished()	
			currentX = -1
			currentY = -1
		}
	}
}

function gameOver() {
	timer.stop()
	alert("game over")
	//console.log("game over")
	currentX = -1
	currentY = -1
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

function gameFinished() {
	timer.stop()
	alert("finish")
	//console.log(finish")
	currentX = -1
	currentY = -1
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

function handleUp() {
	if (isPlayStarted()) {
		gameOver()
	}
}

function getTypeAtCoord(x, y) {
	
	let colorAtCoord = ctx.getImageData(x, y, 1, 1).data
	//console.log(colorAtCoord)

	if (isWallColor(colorAtCoord)) {
		return TYPE_WALL
	} else if (isStartPointColor(colorAtCoord)) {
		return TYPE_START
	} else if (isFinishPointColor(colorAtCoord)) {
		return TYPE_FINISH
	} else if (isTrailColor(colorAtCoord)) {
		return TYPE_TRAIL
	} else {
		TYPE_WAY
	}
}

function isWallColor(color) {
	// black
	return color[0] < 100 && color[1] < 100 && color[2] < 100
}

function isStartPointColor(color) {
	// red
	return color[0] > 150 && color[1] < 150 && color[2] < 150
}

function isFinishPointColor(color) {
	// green
	return color[0] < 150 && color[1] > 150 && color[2] < 150
}

function isTrailColor(color) {
	// blue
	return color[0] < 150 && color[1] < 150 && color[2] > 150
}

function isHittingWall(typeAtCoord) {
	return typeAtCoord === TYPE_WALL && isPlayStarted()
}

function isPlayStarted() {
	return currentX !== -1 && currentY !== -1
}


