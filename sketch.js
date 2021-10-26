//declaring variables
var trex ,trex_running,trex_collided;
var ground, ground_Image;
var invisibleGround;
var cloud, cloudImage;
var obstacle, obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score = 0;
var cloudsGroup, obstacleGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var gameOver,gameOverImage;
var reset, resetImage;
var die
var checkpoint
var jump 

//to load animation, images and sounds
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png", "trex4.png") ;
  trex_collided = loadAnimation("trex_collided.png");
  ground_Image = loadImage("ground2.png");
  cloudImage = loadImage ("cloud.png");
  obstacle1 = loadImage ("obstacle1.png");
  obstacle2 = loadImage ("obstacle2.png");
  obstacle3 = loadImage ("obstacle3.png");
  obstacle4 = loadImage ("obstacle4.png");
  obstacle5 = loadImage ("obstacle5.png");
  obstacle6 = loadImage ("obstacle6.png");
  resetImage = loadImage ("reset.png");
  gameOverImage = loadImage ("gameOver.png");
  jump = loadSound ("jump.mp3")
  die = loadSound ("die.mp3")
  checkpoint = loadSound ("checkpoint.mp3")
}

//runs once; at the start of the game; is used to create stuff
function setup(){
  //creating canvas
  createCanvas(600,200);
  
  //create a trex sprite, gave it animation and scaled it down
  trex = createSprite (50,160);
  trex.addAnimation("running trex", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = (0.5);

  //to show the collider radius
  trex.debug = false;

  //shape,x-offset,y-offest,radius/width,height
  trex.setCollider("circle", 0,0,35);

  //created a ground sprite, gave it image
  ground = createSprite(300,180,600,10);
  ground.addImage(ground_Image);
  //to move the ground right to left
  ground.velocityX = -4;

  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;

  //Creating group
  cloudsGroup = new Group();
  obstacleGroup = new Group();

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.8

  reset = createSprite(300,130);
  reset.addImage(resetImage);
  reset.scale = 0.5

}

//runs for every frame, continuous function
function draw(){
  //clears the screen and gives it color
  background(255);

  //condition for playstate
  if(gamestate === PLAY){
    //to make the trex jump when space key is pressed
    if(keyDown("space")&&(trex.y > 155)){
      trex.velocityY = -13;
      jump.play();
    }

    //to give gravity to the trex
    trex.velocityY = trex.velocityY+1;

    //to make the ground infinite
    //checking if ground is leaving the left edge
    if(ground.x<0){
      //starting it back from center of the canvas
      ground.x = width/2;
    }

    //giving ground velocity
    ground.velocityX = -(4+score/100);

    //We are adding score to the value and we are rounding it so there are no decimals
    score = score+Math.round(getFrameRate()/60);

    //Calling function
    spawnClouds();
    spawnObstacles();

    gameOver.visible = false;
    reset.visible = false;

    //Making a checkpoint sound every 100 score the trex achieves
    //% = Mod or Modulus, is used to find the remainder
    if(score%100 ===0 && score>0){
      checkpoint.play();
    }

    //condition to end the game
    if(trex.isTouching(obstacleGroup)){
      gamestate = END; 
      die.play();
    //trex.velocityY=-13
    //jump.play(); 
    }

  }
  
  //condition for endstate
  else if(gamestate === END){

    //to stop the objects
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.velocityY = (0);

    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    trex.changeAnimation("collided", trex_collided);

    gameOver.visible = true;
    reset.visible = true;

     //Reseting the game
    if(mousePressedOver(reset)){
      console.log ("Reset");
      restart();
    }
  }

  //The text which displays the score 
  text("Score :"+score,25,25);

  //to make the trex walk on top of the ground
  trex.collide(invisibleGround);
  
  //display sprites
  drawSprites();
}

function spawnClouds(){
  if(frameCount%60 ===0){
    cloud = createSprite(600,30);
    cloud.velocityX = -4;
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.y = Math.round(random (10,90));

    console.log (trex.depth);
    console.log (cloud.depth);
    //we are making the trex depth equal to the cloud depth and adding 1 depth so the trex is infront of the cloud
    trex.depth = cloud.depth;
    trex.depth +=1;

    //This is how much time a object stays in your board
    cloud.lifetime=170;

    //adding clouds in cloud group
    cloudsGroup.add(cloud);
  }
 
}

//This is a custom function which allows us to create a obstacle every 80 frames with a random obstacle
function spawnObstacles(){
  if(frameCount%60 ===0){
    obstacle = createSprite (600,165);
    obstacle.velocityX = -(5+score/100);
    obstacle.lifetime = 200;
    obstacle.scale = 0.5;

    var randomObstacle = Math.round(random(1,6));
    switch(randomObstacle){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default:break;
    }

    //adding obstacles in group
    obstacleGroup.add(obstacle);

  }
}

function restart(){
  gamestate = PLAY;
  score = 0;
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running trex", trex_running);
}