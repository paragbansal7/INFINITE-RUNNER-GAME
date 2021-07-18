var PLAY = 1;
var END = 0;
var gameState = PLAY;
var qwe = 5;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

var highScore = 0;
var lifeline = 3;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);


  trex = createSprite(50, height / 2 + 140, 20, 50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);


  trex.scale = 0.5;

  ground = createSprite(width/2, height / 2 + 155, camera.position.x, 20);
  ground.addImage("ground", groundImage);

  gameOver = createSprite(camera.position.x, height / 2 - 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(camera.position.x-width/2.2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(width/2, height / 2 + 170, width, 10);
  invisibleGround.visible = false;
  

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();


  trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
  //trex.debug = true

  score = 0;
 camera.position.x = width/2;
 camera.position.y = height/2;
}

function draw() {

  background("lightblue");
  //displaying score
  var textPos = camera.position.x+width/2.5
  fill("red")
  text("Score= " + score, textPos, 40);
  text("High Score= " + highScore, textPos, 60);
  text("Lifeline = " + lifeline, textPos, 20);  

  console.log(camera.position.x,ground.width)

  if(frameCount%100===0){
    qwe+=2;
  }
  
  invisibleGround.x = camera.position.x;  

  if (gameState === PLAY) {
    //move the 
    gameOver.visible = false;
    restart.visible = false;

    camera.position.x+=qwe;
    trex.x= camera.position.x-width/2.2
    //change the trex animation
    
    trex.changeAnimation("running", trex_running);

    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    //jump when the space key is pressed
    if ((touches.length > 0 || keyDown("space")) && trex.y >= height / 2 + 100) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

      lifeline = lifeline - 1;

      if (highScore < score) {
        highScore = score;
      }

      if (lifeline === 0) {
        highScore = 0;
      }

    }



  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);



    ground.velocityX = 0;
    trex.velocityY = 0


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)||touches.length>0) {
      reset();

    }

    if (lifeline === 0 && mousePressedOver(restart))
      lifeline = 3;
  }


  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();
}




function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x*6/4 , height / 2 + 144, 10, 40);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 600;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x*3.5/2, height / 2 - 80, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;

    //assign lifetime to the variable
    cloud.lifetime = 600;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset() {

  score = 0;
  gameState = PLAY;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

}