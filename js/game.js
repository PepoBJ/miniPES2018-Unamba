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
        minHorizontalOffset = 100,
        maxHorizontalOffset = 400,        
        keyPressed = {},
        keyMap = {
			left: 37,
			up: 38,
			right: 39,
			down: 40
        },
		now = 0,
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
		

        showLifeAndScore();

        addListener(document, 'keydown', keyDown);
		addListener(document, 'keyup', keyUp);

        function anim () {
            loop();
            requestAnimFrame(anim);
        }
        anim();
    }

	function showLifeAndScore () 
	{
        bufferctx.fillStyle="rgb(59,59,59)";
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
            defaultHeight : 32
		};
		
        ball = new Image();
        ball.src = 'img/ball.png';
        ball.posX = (canvas.width / 2) - (ball.width / 2);
        ball.posY = (canvas.height / 2) - (ball.height == 0 ? settings.defaultHeight : ball.height);
        ball.idGoal = false;
        ball.speed = 5;

		ball.doAnything = function() 
		{
            if (keyPressed.left && ball.posX > 5)
                ball.posX -= ball.speed;
            if (keyPressed.right && ball.posX < (canvas.width - ball.width - 5))
				ball.posX += ball.speed;
			if (keyPressed.up && ball.posY > 5)
				ball.posY -= ball.speed;
			if (keyPressed.down && ball.posY < (canvas.height - ball.height - 5))
				ball.posY += ball.speed;
        };

		ball.goal = function() 
		{
			this.goal = true;
			
			setTimeout(function () {
				ball = new Ball();
			}, 500);
        };

        return ball;
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

	function draw() 
	{
        ctx.drawImage(buffer, 0, 0);
    }

	function showGoal() 
	{
        bufferctx.fillStyle="rgb(255,0,0)";
        bufferctx.font="bold 35px Arial";
        bufferctx.fillText("Goool", canvas.width / 2 - 100, canvas.height / 2);
    }

	function update() 
	{
        drawBackground();

        bufferctx.drawImage(ball, ball.posX, ball.posY);
       
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