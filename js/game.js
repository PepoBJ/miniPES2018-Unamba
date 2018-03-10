// nos marca los pulsos del juego
window.requestAnimFrame = (function () 
{
    return  window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
        function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var game = (function () 
{

    // Variables globales a la aplicacion
    var canvas,
        ctx,
        buffer,
        bufferctx,
        ball,
		bgCampo,
		numPlayer = 5,
        minHorizontalOffset = 100,
		maxHorizontalOffset = 400,    
		gol = false,    
        keyPressed = {},
        keyMap = {
			left: 37,
			up: 38,
			right: 39,
			down: 40
		},
		playersA = [],
        playersB = [],
		playerSrc = [
			'img/jugador1.png',
			'img/jugador2.png'
		],
		now = 0,
		posiciones = [],
		equipoA = 0,
		equipoB = 0;

    function loop() {
        update();
        draw();
    }

	function preloadImages () 
	{		
        bgCampo = new Image();
        bgCampo.src = 'img/campo.png';
    }

	function init() 
	{
        preloadImages();

        canvas = document.getElementById('canvas');
        ctx = canvas.getContext("2d");

        buffer = document.createElement('canvas');
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        bufferctx = buffer.getContext('2d');

		ball = new Ball();
		
		for(var i = 0 ; i < numPlayer; i++)
		{
			playerA = new Player(0);
			playersA.push(playerA);

			playerB = new Player(1);
			playersB.push(playerB);

			posiciones.push([
				new Point(playerA.posX, playerA.posY),
				new Point(playerA.posX + 50, playerA.posY),
				new Point(playerA.posX, playerA.posY + 50)
			]);

			posiciones.push([
				new Point(playerB.posX, playerB.posY),
				new Point(playerB.posX + 40, playerB.posY),
				new Point(playerB.posX, playerB.posY + 40)
			]);
		}

        addListener(document, 'keydown', keyDown);
		addListener(document, 'keyup', keyUp);

        function anim () {
            loop();
            requestAnimFrame(anim);
        }
        anim();
	}
	
	function showScore () 
	{
        bufferctx.fillStyle="#7607ef";
        bufferctx.font="bold 16px Arial";
        bufferctx.fillText("Equipo A: " + equipoA, canvas.width - 100, 20);
        bufferctx.fillText("Equipo B: " + equipoB, canvas.width - 100,40);
    }

	function getRandomNumber(range) 
	{
        return Math.floor(Math.random() * range);
    }

	function Ball() 
	{
		var settings = 
		{
			defaultHeight : 32,
			defaultWidth : 32
		};
		
        ball = new Image();
        ball.src = 'img/ball.png';
        ball.posX = (canvas.width / 2) - (settings.defaultWidth / 2);
        ball.posY = (canvas.height / 2) - (settings.defaultHeight / 2);
        ball.isGoal = false;
        ball.speed = 5;

		ball.doAnything = function() 
		{
			if(ball.isGoal)
			{
				ball.goal();
				return;
			}

			if ((keyPressed.left && checkCollision(
				[
					new Point(ball.posX - ball.speed, ball.posY),
					new Point(ball.posX  - ball.speed + settings.defaultWidth, ball.posY),
					new Point(ball.posX  - ball.speed, ball.posY + settings.defaultHeight)
				]
			)) || (keyPressed.right && checkCollision(
				[
					new Point(ball.posX + ball.speed, ball.posY),
					new Point(ball.posX  + ball.speed + settings.defaultWidth, ball.posY),
					new Point(ball.posX  + ball.speed, ball.posY + settings.defaultHeight)
				]
			)) || (keyPressed.up && checkCollision(
				[
					new Point(ball.posX, ball.posY - ball.speed),
					new Point(ball.posX + settings.defaultWidth, ball.posY - ball.speed),
					new Point(ball.posX, ball.posY + settings.defaultHeight - ball.speed)
				]
			)) || (keyPressed.down && checkCollision(
				[
					new Point(ball.posX, ball.posY + ball.speed),
					new Point(ball.posX + settings.defaultWidth, ball.posY + ball.speed),
					new Point(ball.posX, ball.posY + settings.defaultHeight + ball.speed)
				]
			)))
				return;

            if (keyPressed.left && ball.posX > 5)
                ball.posX -= ball.speed;
            if (keyPressed.right && ball.posX < (canvas.width - ball.width - 5))
				ball.posX += ball.speed;
			if (keyPressed.up && ball.posY > 5)
				ball.posY -= ball.speed;
			if (keyPressed.down && ball.posY < (canvas.height - ball.height - 5))
				ball.posY += ball.speed;

			if(ball.posY >= (canvas.height / 2 - 50) && ball.posY <= (canvas.height / 2 + 50))
			{
				
				if(ball.posX <= 5)
				{
					ball.isGoal = true;
					gol = true;
					equipoA ++;
				}
				else if(ball.posX >= canvas.width - (5 + settings.defaultWidth))
				{
					ball.isGoal = true;
					gol = true;
					equipoB ++;
				}
			}
        };

		ball.goal = function() 
		{
			this.idGoal = true;
			
			setTimeout(function () {
				ball = new Ball();
			}, 500);
        };

        return ball;
	}

	function checkCollision(ball)
	{
		return posiciones.some(function(posicion){
			
			return ball[1].x > posicion[0].x && ball[0].x < posicion[1].x && ball[0].y < posicion[2].y && ball[2].y > posicion[0].y;
		});
	}

	function ballAction() 
	{
        ball.doAnything();
    }

	function addListener(element, type, expression, bubbling) 
	{
        bubbling = bubbling || false;

		if (window.addEventListener) 
		{ // Standard
            element.addEventListener(type, expression, bubbling);
		} else if (window.attachEvent) 
		{ // IE
            element.attachEvent('on' + type, expression);
        }
    }

	function keyDown(e) 
	{
        var key = (window.event ? e.keyCode : e.which);
		for (var inkey in keyMap) 
		{
			if (key === keyMap[inkey]) 
			{
                e.preventDefault();
                keyPressed[inkey] = true;
            }
        }
    }

	function keyUp(e) 
	{
        var key = (window.event ? e.keyCode : e.which);
		for (var inkey in keyMap) 
		{
			if (key === keyMap[inkey]) 
			{
                e.preventDefault();
                keyPressed[inkey] = false;
            }
        }
    }

	function Player(typePlayer) 
	{
		var settings = 
		{
			defaultHeight : 66,
			defaultWidth : 66
		};

		player = new Image();
        player.src = playerSrc[typePlayer];
		player.posX = getRandomNumber(canvas.width - (settings.defaultWidth));		
		player.posY = getRandomNumber(canvas.height - (settings.defaultHeight));
		
		return player;
    }

	function draw() 
	{
        ctx.drawImage(buffer, 0, 0);
    }

	function showGoal() 
	{
        document.getElementById('gol').style.color = "rgb(255, 5, 5)";
	}

	function hideGoal()
	{
		setTimeout(function(){
			document.getElementById('gol').style.color = "transparent";
		}, 1500);
	}
	
	function update() 
	{
        drawBackground();

		bufferctx.drawImage(ball, ball.posX, ball.posY);
		
		playersA.forEach(function(player)
		{
			bufferctx.drawImage(player, player.posX, player.posY);
		});

		playersB.forEach(function(player)
		{
			bufferctx.drawImage(player, player.posX, player.posY);
		});
	   
		showScore();

		if(gol)
		{
			showGoal();
			hideGoal();

			gol = false;
		}

        ballAction();
    }

	function drawBackground() 
	{
        bufferctx.drawImage(bgCampo, 0, 0, canvas.width, canvas.height);
    }
    
    return {
        init: init
    }
})();

function Point (x, y) 
{
	this.x = x;
	this.y = y;
}