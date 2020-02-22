var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
        	//remettre la gravite a 300
            gravity: { y: 300 },
            debug: false
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var platforms;
var player;
var cursors; 
var stars;
var scoreText;
var bomb;
var jump;
var healthBar;
var health;
var maxHealth;
var montre;
var v = 0;
var g = 0;
var b = 0;





function preload(){
	this.load.image('background','assets/sky.png');	
	//this.load.image('fond','assets/fond.png');//
	this.load.image('etoile','assets/star.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/blabla.png',{frameWidth: 38, frameHeight: 26});
	this.load.spritesheet('atk','assets/atk.png',{frameWidth: 59, frameHeight: 58});
	this.load.spritesheet('descand','assets/down.png',{frameWidth: 37, frameHeight: 29});
	this.load.image('red-bar','assets/health-red.png');
	this.load.image('green-bar','assets/health-green.png');
	this.load.image('montre','assets/watch.png');

}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
/*	platforms.create(400,580,'sol').setScale(2).refreshBody();
	platforms.create(600,400,'sol').refreshBody();
	platforms.create(50,250,'sol').refreshBody();*/

	platforms.create(60,600,'sol').refreshBody();
	platforms.create(185,600,'sol').refreshBody();
	platforms.create(300,600,'sol').refreshBody();
	platforms.create(410,600,'sol').refreshBody();
	platforms.create(520,600,'sol').refreshBody();
	platforms.create(630,600,'sol').refreshBody();
	platforms.create(740,600,'sol').refreshBody();



	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	this.physics.add.collider(player,platforms);
	player.health = 100;
	player.maxHealth = 100;


	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 8}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
	this.anims.create({
		key:'descand',
		frames: this.anims.generateFrameNumbers('descand', {start: 0, end: 1}),
		frameRate: 10,
		repeat: 1
	});


	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});

	montre = this.physics.add.group({
		key: 'montre',
		repeat:0,
		setXY: {x:600,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,5, 'score:0', {fontSize: '30px', fill:'#000'});
	
	this.physics.add.collider(montre,platforms);
	this.physics.add.overlap(player,montre,collectWatch,null,this);


	healthBar = this.physics.add.staticGroup();
	healthBar.create(117, 50, 'green-bar');
	redBar = this.physics.add.staticGroup();


	healthText = this.add.text(30, 40, 'vie', {fontSize: '20px', fill:'#000'});
	
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player, bombs, hitBomb, null, this);

}



function collectWatch(player, montre){
	montre.disableBody(true,true);

	
	var rdm = Phaser.Math.Between(1, 3);

	if(rdm == 1){//gravity
		g += 1;
		v = 0;
		b = 0;	
	}
	if(rdm == 2){//velocity
		g = 0;
		v += 1
		b = 0;
		
	}
	if(rdm == 3){//bounce
		g = 0;
		v = 0;
		b += 1;
	}

	
}

function update(){

    if( g == 1){
			player.setGravityY(-10000, 0);
		}else{
			player.setGravityY(300);
		}

	if(v == 1){
		if(cursors.left.isDown){
			player.anims.play('left', true);
			//remttre a 300
			player.setVelocityX(-3000);
			player.setFlipX(false);
		}else if(cursors.right.isDown){
				//remttre a 300
			player.setVelocityX(3000);
			player.anims.play('left', true);
			player.setFlipX(true);
		}else{
			player.anims.play('stop', true);
			player.setVelocityX(0);
		}
	//alert('velocity')
	}else{
		if(cursors.left.isDown){
		player.anims.play('left', true);
		//remttre a 300
		player.setVelocityX(-300);
		player.setFlipX(false);
	}else if(cursors.right.isDown){
		//remttre a 300
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(true);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	}

	if(b == 1){
			player.setBounce(1);
		}else{
			player.setBounce(0);
		}

	//DOUBLE SAUT
	if(cursors.up.isDown && save_saut > 0 && save_touch == 1){
        player.setVelocityY(-330);
        save_saut -=1;
        save_touch -=1;
        if (save_saut == 1) {
            player.setVelocityY(-250);
        }
        if (save_saut == 0) {
            player.setVelocityY(-250);
        }
    }
    if (cursors.up.isUp) {
        save_touch = 1;
    }
    if (cursors.up.isUp && player.body.touching.down) {
        save_saut = 2;
    }

    //DESCENDRE D'UNE PLATEFORME
    if(cursors.down.isDown ){
    	player.anims.play('descand',true);
    	player.setVelocityY(350);
    }
}	




function hitBomb(player, bomb, healthBar, healths, health){

	player.health = player.health - 25;
	
	
	redBar.create(-33 + (100 - player.health) * 2,40,'red-bar').setScale(0.25,1).setOrigin(0,0);

	if(player.health <= 0){
		player.setTint(0xff0000);
		this.physics.pause();
		gameOver=true;  
		//player.anims.play('turn');
	}

 	
}




function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
			stars.children.iterate(function(child){
				child.enableBody(true,child.x,0, true, true);
			});
			
		var value = Phaser.Math.Between(1, 2);

		if(value == 1){
			var x = (player.x < 400) ? 
				Phaser.Math.Between(400,800):
				Phaser.Math.Between(0,400);
			var bomb = bombs.create(y, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setGravity(Phaser.Math.Between(-200, 200), 20);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		}

		if(value == 2){
			var y = (player.y < 400) ? 
				Phaser.Math.Between(400,800):
				Phaser.Math.Between(0,400);
			var bomb = bombs.create(16, x, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setGravity(Phaser.Math.Between(-200, 200), 20);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		}
	}
	if(montre.countActive(true)===0){
			montre.children.iterate(function(child){
				child.enableBody(true,child.x,0, true, true);
			});
	}
}