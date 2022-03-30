
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var bg,bgImg;
var lily, lily_idle, lily_jump, lily_dead;
var invisibleGround;
var butterfly1, butterfly2, butterflyImg1, butterflyImg2;
var bee, beeImg;
var beeGroup, butterflyGroup;
var restart, restartImg;
var score = 0;
var jump_noise;
var game_music;
var fail_noise;


function preload(){
  bgImg = loadImage("assets/background.jpg");
  lily_idle = loadAnimation("assets/Idle (1).png");
  lily_jump = loadAnimation("assets/Jump (1).png","assets/Jump (2).png","assets/Jump (3).png", "assets/Jump (4).png", "assets/Jump (5).png")
  lily_dead = loadAnimation("assets/Dead (1).png","assets/Dead (2).png", "assets/Dead (3).png", "assets/Dead (4).png", "assets/Dead (5).png", "assets/Dead (6).png", "assets/Dead (7).png", "assets/Dead (8).png","assets/Dead (9).png", "assets/Dead (10).png", "assets/Dead (15).png", "assets/Dead (19).png", "assets/Dead (22).png", "assets/Dead (25).png",)
  butterflyImg1 = loadImage("assets/Butterfly 1.png");
  butterflyImg2 = loadImage("assets/Butterfly 2.png");
  beeImg = loadImage("assets/Cartoon-Bee.png");
  restartImg = loadImage("assets/restart.png")
  jump_noise = loadSound("assets/RXQHWYP-jump.mp3");
  game_music = loadSound("assets/HinaCC0_011_Fallen_leaves.mp3");
  fail_noise = loadSound("assets/2G7CF5V-gamers-fail-game.mp3")
}



function setup() {  
  createCanvas(windowWidth-750,windowHeight-200);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.x = bg.width/2
  bg.scale = 1.5
  
  restart = createSprite(displayWidth/2,displayHeight/2+150);
  restart.addImage(restartImg);
  restart.visible = false;

  //creating the player sprite
  lily = createSprite(displayWidth-1150, displayHeight-70, 50, 50);
  lily.addAnimation("idle", lily_idle)
  lily.addAnimation("jump", lily_jump);
  lily.addAnimation("dead", lily_dead);
  lily.scale = 0.3
  lily.debug = true
  lily.setCollider("rectangle",0,0,280,280)
  
  //creating invisible ground
  invisibleGround = createSprite(displayWidth/2,displayHeight/2+380,windowWidth-700,20)
  invisibleGround.visible = false

  beeGroup = new Group();
  butterflyGroup = new Group();
}


function draw() {
  background(0); 
  
  
  if(gamestate === PLAY){
    bg.velocityX = -8;
    if(bg.x<450){
      bg.x = bg.width/2;
     
    }   
    
    restart.visible = false;
    bg.visible = true;
    lily.visible = true;

    if(keyDown("space") && lily.y>450){
      lily.velocityY = -10;
      lily.changeAnimation("jump", lily_jump);
      jump_noise.play();
    }

    lily.velocityY = lily.velocityY + 0.8;
    spawnButterfly();
    spawnBee();

    /*if(butterfly1 || butterfly2.isTouching(lily)){
      score += 1;
      butterfly1.destroy()
       
    }*/

    if(butterflyGroup.isTouching(lily)){
      for(var i=0;i<butterflyGroup.length;i++){            
        if(butterflyGroup[i].isTouching(lily)){
            butterflyGroup[i].destroy()            
            score = score+2
            }     
      }
    }

    if(beeGroup.isTouching(lily)){
    /*lily.velocityY = 5;
    lily.changeAnimation("dead", lily_dead);*/
    gamestate = END;
    }
  }


  else if(gamestate === END){
    background(0);
    //bg.velocityX = 0;
    fail_noise.play();
    bg.visible = false;
    beeGroup.setLifetimeEach(-1);
    butterflyGroup.setLifetimeEach(-1);
    lily.visible = false;
    textSize(40);
    text("Score: "+score, displayWidth/2+550, 100);
    textSize(100) 
    fill("red") 
    text("You Lost! ",600,450); 
    restart.visible = true;
    restart.depth = restart.depth + 1;
    if(mousePressedOver(restart)){
      reset()
    }
    beeGroup.destroyEach();
    butterflyGroup.destroyEach();
  }
  lily.collide(invisibleGround);
  drawSprites();
}


function reset(){
  gamestate = PLAY;
  restart.visible = false;
  score = 0;
}

//Spawning butterflies randomly
function spawnButterfly(){
  if(frameCount%100 === 0){
  butterfly1 = createSprite(windowWidth-750,350, 25, 25);
  butterfly1.velocityX = -9 ;
  butterfly1.scale = 0.04;
  butterfly1.lifetime = 340;
  butterfly1.y = Math.round(random(350, 750));

  var rand = Math.round(random(1,2))
  
  switch(rand){
    case 1: butterfly1.addImage(butterflyImg1);
            break;
    case 2: butterfly1.addImage(butterflyImg2);
            break;
    default: break;
  }
  butterflyGroup.add(butterfly1)
}
}

function spawnBee(){
  if(frameCount%80 === 0){
    bee = createSprite(windowWidth-750,350, 50,50);
    bee.velocityX = -8;
    bee.scale = 0.3;
    bee.setCollider("rectangle", 0,0,250,300);
    bee.debug = true;
    bee.lifetime = 340;
    bee.y = Math.round(random(350, 750));
    bee.addImage(beeImg);
    beeGroup.add(bee);
   }

}
