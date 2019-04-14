let balls = [];
const GRAVITY = 5;
let blow = false;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background(0);
  area = new Area(width/2, height/2, height*0.9,1);
}

function draw() {
  background(150,150,150);
  fill(255,140);
  textSize(16);
  text("tap a key to blow them away",width-240,height-20);
  area.display();

  let mouse = createVector(mouseX,mouseY);
  let vector = p5.Vector.sub(area.pos,mouse);
  let distance = vector.mag();

  if(mouseIsPressed){
    if(distance > area.d/2+25 || distance < area.d/2-25){
      balls.push(new Ball(mouseX,mouseY,random(0.5,5),random(150,255),random(150,255),random(150,255)));
    }
  }

  for(let i=balls.length-1; i>=0; i--){
    let b = balls[i];
    for(let j=0; j<balls.length; j++){
      if(j!=i){
        if(balls[j].t1 > 50 && b.t1 > 50){
          b.checkCollision(balls[j]);
          if(b.checkArea(area) == balls[j].checkArea(area)){
            b.applyRepel(balls[j]);
          }
        }
      }
    }

    if(b.checkArea(area,b.initpos) != b.checkArea(area,b.pos)){
      b.initpos = b.pos;
    }

    //wind
    let wind;
    let mag;
    if(keyIsPressed){
      mag = -2;
      wind = createVector(0,mag);
      b.applyForce(wind);
      blow = true;
    }else{
      blow = false;
    }

    //friction
    let c;
    if(b.checkArea(area,b.initpos)){
      c = 0.005;
      if(distance<=area.d/2-25){
        b.applyAttraction(mouse,0.0008);
      }
    }else{
      c = 0.03;
    }
    let speed = b.vel.mag();
    let drageForce = c*speed**2;
    let resistance = p5.Vector.mult(b.vel,-1);
    resistance.normalize();
    resistance.mult(drageForce);
    resistance.limit(b.vel.mag());
    b.applyForce(resistance);

    b.update(); //collision-one check&leave before the other check
    // b.checkBounce(area);
    b.disappear();
    b.display();
  }
  for(let i=balls.length-1; i>=0; i--){
    b = balls[i];
    if(b.pos.x>width||b.pos.x<0||b.pos.y<0){
      balls.splice(i,1);
    }
  }
}
