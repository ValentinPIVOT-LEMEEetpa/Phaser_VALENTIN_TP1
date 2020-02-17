var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
        	//remettre la gravite a 300
            gravity: { y: 300 },
            debug: true
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

}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,580,'sol').setScale(2).refreshBody();
	platforms.create(600,400,'sol').refreshBody();
	platforms.create(50,250,'sol').refreshBody();

	platforms.create(60,600,'sol').refreshBody();
	platforms.create(185,600,'sol').refreshBody();
	platforms.create(300,600,'sol').refreshBody();
	platforms.create(410,600,'sol').refreshBody();
	platforms.create(520,600,'sol').refreshBody();
	platforms.create(630,600,'sol').refreshBody();
	platforms.create(740,600,'sol').refreshBody();

	healths = this.physics.add.staticGroup();
	healths.create(300, 20, 'red-bar');

	healthBar = this.physics.add.staticGroup();
	healthBar.create(300, 20, 'green-bar');

	
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
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	healthText = this.add.text(210, 20, 'vie', {fontSize: '32px', fill:'#000'});
	//game.add.create(300, 20, 'red-bar');

	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player, bombs, hitBomb, null, this);

}




function update(){
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

/*function setHealth (amount) {

    player.health = amount;

    if (player.health > player.maxHealth)
    {
        player.health = player.maxHealth;
    }

    return this;

}
*/

function damage(amount) {
	
    if (player.health >= 1)
    {
        player.health = player.health - 25;
        //alert('amount ok');
        
	}
           
    if (player.health <= 0)
    {
    	//this.kill();
    	player.setTint(0xff0000);
		//this.physics.pause()
    	gameOver=true;
    }
   

    return this;
}


function hitBomb(player, bomb){

	return damage(25);
	alert('damage ok');

  	healthBar.scale.setTo( player.maxHealth / amount , 1);
        alert('healthBar ok');
	//player.anims.play('turn');

	
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
}