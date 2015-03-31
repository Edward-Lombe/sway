'use strict';
(function sway() {
	var iWindowWidth = window.innerWidth,
		iWindowHeight = window.innerHeight,
		aMovementArray,
		aColorArray,
		iTriangleSize,
		rows = 0,
		columns = 0;

	(function init() {
		window.addEventListener('resize', resizeCanvas, false);
		resizeCanvas();
		
		aMovementArray = createMovementArray(columns, rows, iTriangleSize);
		aColorArray = createColorArray(columns, rows);

		requestAnimationFrame(frame);

	})();
	
	function frame () {
		draw(aMovementArray, aColorArray);
		requestAnimationFrame(frame);
	}

	function resizeCanvas() {
		iWindowWidth = window.innerWidth;
		iWindowHeight = window.innerHeight;

		iTriangleSize = (iWindowHeight / 4) / (Math.sqrt(3) / 2);
		console.log(iTriangleSize);
		rows = 5;
		columns = 0;
		while (columns * iTriangleSize < iWindowWidth + (iTriangleSize * 1.5)) columns++;
		
		aMovementArray = createMovementArray(columns, rows, iTriangleSize);
		aColorArray = createColorArray(columns, rows);
		
		document.getElementById('canvas').width = iWindowWidth;
		document.getElementById('canvas').height = iWindowHeight;
	}

	function RandomMovement(center, r, speed) {
		var angle = Math.random() * Math.PI * 2;
		var distance = Math.floor(Math.random() * r);
		var current = center.copy();

		function inCircle(point) {
			return center.distance(point) < r;
		}

		function newDirection () {
			angle = Math.random() * Math.PI * 2;
			distance = 2 * r;
		}

		return Object.create(
			{
				move : function () {
					var next;
					do {
						if (distance > 0) distance = distance - speed;
						else newDirection();
						next = current.copy();
						next.x = current.x + Math.cos(angle) * speed;
						next.y = current.y + Math.sin(angle) * speed;
					} while (!inCircle(next));
					current = next.copy();
					return next;
				},
				pos : function () {
					return current;
				}
			}
		);
	}

	function Point(x, y) {
		return Object.create(
			{
				toString : function () {
					return this.x + ', ' + this.y;
				},
				distance : function (point) {
					return Math.sqrt(
						Math.pow(this.x - point.x, 2) +
						Math.pow(this.y - point.y, 2)
					);
				},
				copy : function () {
					return Point(this.x, this.y);
				}
			}, {
				x : { 
					value : x || 0,
					writable : true
				},
				y : { 
					value : y || 0,
					writable : true
				}
			}
		);
	}

	function createMovementArray(width, height, sideLength) {
		var array = [],
			xStart = -sideLength / 2,
			yStart = 0,
			xIncrement = sideLength,
			yIncrement = sideLength * Math.sqrt(3) / 2,
			x = xStart,
			y = yStart;
		// width = ~~(width / 2) + 1;
		for (var i = 0; i < height; i++) {
			array[i] = []
			for (var j = 0; j < width; j++) {
				array[i][j] = RandomMovement(Point(x, y), sideLength / 3 , 0.50);
				x += xIncrement;
			}
			y += yIncrement;
			x = xStart + (i % 2 == 0 ? sideLength / 2 : 0);
		}
		return array;
	}

	function createColorArray(width, height) {
		width = (width - 1) * 2;
		height = height - 1;
		var array = [];
		for (var i = 0; i < height; i++) {
			array[i] = [];
			for (var j = 0; j < width; j++) {
				array[i][j] = randomColor();
			}
		}
		return array;
	}



	function draw(a, c) {
		clear();
		for (var i = 1; i < a.length - 1; i++) {
			for (var j = 1; j < a[i].length - 1; j++) {
				a[i][j].move();
			}
		}
		for (var i = 0; i < a.length - 1; i++) {
			for (var j = 0; j < a[i].length - 1; j++) {
				var p1, p2, p3;
				
				if (i % 2 == 0) {
					p1 = a[i][j].pos();
					p2 = a[i][j + 1].pos();
					p3 = a[i + 1][j].pos();
					drawTriangle(p1, p2, p3, c[i][j*2]);
					p1 = a[i + 1][j + 1].pos();
					drawTriangle(p1, p2, p3, c[i][j*2 + 1]);
				} else {
					p1 = a[i][j].pos();
					p2 = a[i + 1][j].pos();
					p3 = a[i + 1][j + 1].pos();
					drawTriangle(p1, p2, p3, c[i][j*2]);
					p2 = a[i][j + 1].pos();
					drawTriangle(p1, p2, p3, c[i][j*2 + 1]);
				}
			}
		}
	}


	function randomColor() {
		var colors = ['#F22613','#D91E18','#96281B','#EF4836','#D64541',
			'#C0392B','#CF000F','#E74C3C','#DB0A5B','#F64747','#F1A9A0',
			'#D2527F','#E08283','#F62459','#E26A6A','#DCC6E0','#663399',
			'#674172','#AEA8D3','#913D88','#9A12B3','#BF55EC','#BE90D4',
			'#8E44AD','#9B59B6','#446CB3','#E4F1FE','#4183D7','#59ABE3',
			'#81CFE0','#52B3D9','#C5EFF7','#22A7F0','#3498DB','#2C3E50',
			'#19B5FE','#336E7B','#22313F','#6BB9F0','#1E8BC3','#3A539B',
			'#34495E','#67809F','#2574A9','#1F3A93','#89C4F4','#4B77BE',
			'#5C97BF','#4ECDC4','#A2DED0','#87D37C','#90C695','#26A65B',
			'#03C9A9','#68C3A3','#65C6BB','#1BBC9B','#1BA39C','#66CC99',
			'#36D7B7','#C8F7C5','#86E2D5','#2ECC71','#16a085','#3FC380',
			'#019875','#03A678','#4DAF7C','#2ABB9B','#00B16A','#1E824C',
			'#049372','#26C281','#F5D76E','#F7CA18','#F4D03F','#FDE3A7',
			'#F89406','#EB9532','#E87E04','#F4B350','#F2784B','#EB974E',
			'#F5AB35','#D35400','#F39C12','#F9690E','#F9BF3B','#F27935',
			'#E67E22','#ececec','#6C7A89','#D2D7D3','#EEEEEE','#BDC3C7',
			'#ECF0F1','#95A5A6','#DADFE1','#ABB7B7','#F2F1EF','#BFBFBF'];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function drawTriangle (point1, point2, point3, color) {
		var canvas = document.getElementById('canvas');
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(point1.x, point1.y);
			ctx.lineTo(point2.x, point2.y);
			ctx.lineTo(point3.x, point3.y);
			ctx.fill();
		}
	}

	function clear() {
		var canvas = document.getElementById('canvas');
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

})();

