const canvas = document.getElementById("snake"); // Get the canvas element
const context = canvas.getContext('2d'); // Get its drawing context
let interval; // Used to store the setInterval() return value
// Define the different parts of our snake body
const head = {
  x: Math.floor(Math.random()*90)*10 + 10,
  y: Math.floor(Math.random()*90)*10 + 10,
  color: "green"
};
const tail = {x: null, y:null, color:"red"};
const left_leg = {x: null, y:null, color:"blue"};
const right_leg = {x: null, y:null, color:"blue"};
function initSnake(){
    clearInterval(interval); // Clear any existing intervals
    let direction = 'right'; // Set initial direction
    moveHead(direction); // Move the head in that direction
    interval = setInterval(() => {moveBody()}, 75); // Start moving the rest of the body every 75ms (arbitrary)
}
initSnake(); // Call once to start the snake
document.addEventListener('keydown', event => {handleInput(event)}); // Listen for keyboard input
function handleInput(event){
    switch (event.key) {
        case 'ArrowUp':
            changeDirection('up')
            break;
        case 'ArrowDown':
            changeDirection('down')
            break;
        case 'ArrowLeft':
            changeDirection('left')
            break;
        case 'ArrowRight':
            changeDirection('right')
            break;
        default:
            console.log(`Invalid Key Pressed ${event}`);
    }
}
function changeDirection(newDir){
    const oppositeDirections = {'up':'down','down':'up','left':'right','right':'left'}; // Array containing opposite directions
    if((oppositeDirections[head.dir] && newDir === oppositeDirections[head.dir]) || (!tail.dir &&!left_leg.dir&&!right_leg.dir))return false; // Don't allow going back the same way twice or without a body part
    else{
        clearCanvas(); // Clear everything before changing direction
        if(!tail.dir||!left_leg.dir||!right_leg.dir)//If there isn't already a body part set the first leg in the correct direction
          [left_leg,right_leg][['left','right'].indexOf(newDir)].dir=newDir;
        else{
          tail.dir=head.dir; //Set the second leg to follow the first
          head.dir=newDir; //Change the main heading
        }
        drawSnake([head,[left_leg,right_leg],[tail]]); //Redraw the whole snake
      }
}
function moveHead(direction){
    clearCanvas(); //Clear previous position
    head.oldX = head.x; // Store old coordinates for use later
    head.oldY = head.y;
    switch (direction) {
        case 'up':
            head.y -= 10;
            break;
        case 'down':
            head.y += 10;
            break;
        case 'left':
            head.x -= 10;
            break;
        case 'right':
            head.x += 10;
            break;
        default:
            throw Error(`${direction} is not a valid direction`);
    }
    checkCollision(); // Check for collisions after moving
    drawSnake([[head],[[left_leg,right_leg]],[]]); // Redraw just the head
}
function moveBody(){
    clearCanvas(); // Clear previous positions
    if(tail.dir){
      tail.oldX = tail.x; //Store old coordinates for use later
      tail.oldY = tail.y;
      switch (tail.dir) {
        case 'up':
            tail.y-=10;
            break;
        case 'down':
            tail.y+=10;
            break;
        case 'left':
            tail.x-=10;
            break;
        case 'right':
            tail.x+=10;
            break;
        default:
            throw Error(`${tail.dir} is not a valid direction`)
      }
      checkTailCollisions();//Check for collision with tail
      drawSnake([[],[[left_leg,right_leg],[tail]]]); //Redraw Tail Only
    }else if(left_leg.dir){
      left_leg.oldX = left_leg.x; //Store old coordinates for use later
      left_leg.oldY = left_leg.y;
      switch (left_leg.dir) {
        case 'up':
            left_leg.y-=10;
            break;
        case 'down':
            left_leg.y+=10;
            break;
        case 'left':
            left_leg.x-=10;
            break;
        case 'right':
            left_leg.x+=10;
            break;
        default:
            throw Error(`${left_leg.dir} is not a valid direction`)
      }
      checkLegCollisions(['left']); //Check for collision with legs
      drawSnake([[],[[left_leg],[right_leg],[tail]]]); //Redraw Legs
    }else if(right_leg.dir){
      right_leg.oldX = right_leg.x; //Store old coordinates for use later
      right_leg.oldY = right_leg.y;
      switch (right_leg.dir) {
        case 'up':
            right_leg.y-=10;
            break;
        case 'down':
            right_leg.y+=10;
            break;
        case 'left':
            right_leg.x-=10;
            break;
        case 'right':
            right_leg.x+=10;
            break;
        default:
            throw Error(`${right_leg.dir} is not a valid direction`)
      }
      checkLegCollisions(['right']); //Check for collision with legs
      drawSnake([[],[[left_leg,right_leg],[tail]]]); //Redraw Legs
    }
}
function checkLegCollisions(legs=[]){
   legs.forEach(leg =>{
     if(checkForCollision({...leg},{color:'black'})){
       endGame();
       return true;
     }
   });
}
function checkTailCollisions(){
  if(checkForCollision(tail,{color:'black'})||checkForSelfCollision())endGame();
}
function checkForCollision(part={x:null,y:null},blocker={{color:'white'}}){
    blockers.some(b=>{if(colorsMatch(context.getImageData(part.x,part.y,10,10), b))return true}); // Loop over blocks until we hit a match
    function colorsMatch(dataA, dataB) { // Function to compare two image datas pixel by pixel
        var mismatchCount = 0;
        for (var i = 0; i < dataA.data.length; i++) {
            if (dataA.data[i]!== dataB.data[i])mismatchCount++;
        }
        return mismatchCount===0;
    };
}
function checkForSelfCollision(){
    return [[head,...bodyParts]].some(([a,...rest])=>rest.some(b=>a!==b&&a.x===b.x&&a.y===b.y)); // Check whether any body parts collide with themselves except the head
}
function endGame(){clearInterval(interval)} // End the game upon hitting anything
function drawSnake(partsArr=[]){drawBlocks(...partsArr);} // Draw both blocks and bodies
function drawBlocks(...blocksArr){ //Function to draw an array of rectangles onto the canvas
    blocksArr.flat().filter(({x,y})=>!!x).forEach(({x,y,color='white'})=>{ // Filter out undefined values from nested arrays and skip ones missing X/Y properties
        context.fillStyle = color;
        context.fillRect(x,y,10,10);
    })
}
function clearCanvas(){context.clearRect(0,0,canvas.width,canvas.height);} // Clear the ent
