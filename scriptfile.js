class Player {

    //takes in the player's starting xPos, yPos and fieldOfView which is an int anywhere between 0 and 180. It represents the angle of the field of view. drawDistance is the length to which each ray should go. And topdownViewCTX is the context of the top down canvas, and FPVContext is the context of the first person canvas.
   //rotate orientation represents the angle at which the player is facing. This will decide the direction in which the rays are to be drawn
    constructor(xPos, yPos, fieldOfView, drawDistance, topDownViewCtx, FPVCtx, rotateOrientation) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.fieldOfView = fieldOfView
        this.drawDistance = drawDistance;
        this.topDownViewCtx = topDownViewCtx;
        this.FPVCtx = FPVCtx;
        this.rotateOrientation = rotateOrientation;

    }

    //this function will draw the rays that will register objects in their path
     visualize(){
      //  console.log("visualize activated");
    }


    turnLeft(){
       // console.log("turnRight activated; rotate Orientation: " + this.rotateOrientation);
        this.rotateOrientation = this.rotateOrientation - 1;
        if(this.rotateOrientation<0){
            this.rotateOrientation=360;
        }
    }

    turnRight(){
      //  console.log("turnLeft activated; rotate Orientation: " + this.rotateOrientation);
        this.rotateOrientation = this.rotateOrientation + 1;
        if(this.rotateOrientation>360){
            this.rotateOrientation=0;
        }
    }

    moveForward(){

        //step 1: get the angle of the current rotation orientation
        let xVelocity = Math.cos(convertDegreesToRadians(this.rotateOrientation)) * 10;
        let yVelocity = Math.sin(convertDegreesToRadians(this.rotateOrientation))* 10;

      //  console.log("moveForward values: xVelocity: " + xVelocity + " ; yVelocity :" + yVelocity);

        this.xPos = this.xPos + xVelocity;
        this.yPos = this.yPos + yVelocity;

    }


    moveBackwards(){
        //step 1: get the angle of the current rotation orientation
        let xVelocity = Math.cos(convertDegreesToRadians(this.rotateOrientation)) * 10;
        let yVelocity = Math.sin(convertDegreesToRadians(this.rotateOrientation))* 10;

        //  console.log("moveForward values: xVelocity: " + xVelocity + " ; yVelocity :" + yVelocity);

        this.xPos = this.xPos - xVelocity;
        this.yPos = this.yPos - yVelocity;

    }




    //this function will shoot multiple rays within the field of view
    //after one ray has finished, draw the results on the FPV canvas
    rayTrace(){
        console.log("ray trace");

        this.FPVCtx.clearRect(0, 0, this.FPVCtx.canvas.width, this.FPVCtx.canvas.height);

        //step 1: calculate the starting slope. then loop through till end slope
        //loop: x= (starting Slope)
        //follow this format: rayResult = drawSingleRay(x, drawDisstance);
        //                    this.renderFPV(rayResultt)

        //end of loop. loop through end slope.

        let currentRayPixelData;

        //this value instantiates at 0 every time rayTrace is called so that is always starts at the first screen section and resets back to 0 for every ray trace.
        let screenSegmentToRender = 0;

        let screenSegmentWidth = this.segmentizeScreen(this.fieldOfView, this.FPVCtx)[0];

        console.log("screenSegmentWidth: " + screenSegmentWidth);

        let rayScope = this.rotateOrientation + this.fieldOfView;
      //  console.log("rotateOrientation " + this.rotateOrientation + " and rayScope: " + rayScope);
        for(let angleInDegrees=this.rotateOrientation; angleInDegrees < rayScope; angleInDegrees = angleInDegrees + 1){
          currentRayPixelData = this.drawSingleRay(angleInDegrees, this.drawDistance);

          //Note you have to experiment with different values to feed into calculateHeightSegment. Should you input the direct distance from the player to the pixel (hypotenuse) or the sides of the triangle view
            let extractedBlueLine = currentRayPixelData[7];
            let finalizedExtractedBlueLine = Math.abs(extractedBlueLine);
            let distancefromPlayer = currentRayPixelData[3];

          //  console.log("FUTURECOP: finalizedExtractedBlueLine: " + finalizedExtractedBlueLine);
          //  console.log("FUTURECOP: distanceFromPlayer: " + distancefromPlayer );

            let distanceDiff = finalizedExtractedBlueLine + (distancefromPlayer - finalizedExtractedBlueLine);

            let heightOfSegment = this.calculateHeightOfSegment(currentRayPixelData[7]);

          let segmentHeightBlock = this.FPVCtx.canvas.height - heightOfSegment;

          let segmentStartingYPos = segmentHeightBlock / 2;
       //     console.log("heightOfSegment: " + heightOfSegment + " ; segmentStartingYPos: " + segmentStartingYPos);
          this.renderFPVSingleRay(currentRayPixelData, screenSegmentToRender, screenSegmentWidth, segmentStartingYPos, heightOfSegment, this.FPVCtx);
         //   console.log("currentRayPixelData: " + currentRayPixelData[0] + " red: " + currentRayPixelData[1] + " green: " + currentRayPixelData[2] + " blue: " + currentRayPixelData[3]);



            //explicitly defined function below. Delete after you've visualized and verified
            //If the ray detects an object, it will visualize the blue and purple lines

            if(currentRayPixelData[0]==true) {



                let purpleLine = currentRayPixelData[6];
                let blueLine = currentRayPixelData[7];

                document.getElementById("blueLineLengthStat").innerText = blueLine;

                document.getElementById("distanceFromPlayerLengthStat").innerText = distancefromPlayer;

                let x = currentRayPixelData[2][0];
                let y = currentRayPixelData[2][1];

                //if this doesn't work, try subtracting 90
                let perpendicularAngle = angleInDegrees + 90;

                let slopeOfPerpendicularAnagle = convertDegreesToRadians(perpendicularAngle);

                let xVelocity = Math.cos(slopeOfPerpendicularAnagle);
                let yVelocity = Math.sin(slopeOfPerpendicularAnagle);
                /**
                for(let j=0; j<purpleLine; j=j+1){
                    x = x + xVelocity;
                    y = y + yVelocity;

                    this.topDownViewCtx.fillStyle = "purple";
                    this.topDownViewCtx.fillRect(Math.floor(x), Math.floor(y), 1, 1);

                }
                */
                this.topDownViewCtx.fillStyle = "black";



                let playerFacingDirection = (this.rotateOrientation + this.fieldOfView) / 2;
                playerFacingDirection = this.rotateOrientation + (( (this.rotateOrientation + this.fieldOfView) - this.rotateOrientation ) / 2);
                let playerFacingDirectionSlope = convertDegreesToRadians(playerFacingDirection);


                let blueLineXVelocity = Math.cos(playerFacingDirectionSlope);
                let blueLineYVelocity = Math.sin(playerFacingDirectionSlope);

            //    console.log("blueLine X Velocity: " + blueLineXVelocity);
             //   console.log("blueLine Y Velocity: " + blueLineYVelocity);

                let blueXPos = this.xPos;
                let blueYPos = this.yPos;

             //  blueLine = Math.abs(blueLine);

                
            /**
                for(let h=0; h<blueLine; h=h+1){
                    blueXPos = blueXPos + blueLineXVelocity;
                    blueYPos = blueYPos + blueLineYVelocity;

                    let distanceFromPlayer = currentRayPixelData[3];

                    console.log("blueLineLoop: h: " + h + " ; blueLine: " + blueLine + " ; drawDistance: " + distanceFromPlayer);

                    this.topDownViewCtx.fillStyle = "blue";
                    this.topDownViewCtx.fillRect(Math.floor(blueXPos), Math.floor(blueYPos), 1, 1);
                    //console.log("complexInnerMethod: " + blueLine);
                    console.log("H: " + h);
                    document.getElementById("blueLineLengthStat").innerText = " " + h;
                }
             */

              //  document.getElementById("blueLineLengthStat").innerText = blueLine;



            }







            screenSegmentToRender = screenSegmentToRender + 1;
         //   console.log("screenSegmentToRender: " + screenSegmentToRender);

         // this.getFPVScreenSection()
        //  this.renderFPVSinglePixel(currentRayPixelData);

            document.getElementById("playerRotationStat").innerText = this.rotateOrientation;


        }

      //  this.FPVCtx.clearRect(0, 0, this.FPVCtx.canvas.width, this.FPVCtx.canvas.height);

    }

    //Will shoot out a single ray and gather information about objects in path
    //drawDistanceRaw is the raw parameter of how far the ray should shoot. But thhe actual draw distance should be calculated based on the angle. use an inner function
     drawSingleRay(angleInDegrees, drawDistanceRaw){

       //  console.log("drawSingleRay Activated");



         let slope = convertDegreesToRadians(angleInDegrees);

    //    let fpvScreenSection = this.getFPVScreenSection(slope);

         //SC = scanner particle
        let SCXpos = player1.xPos;
        let SCYpos = player1.yPos;

        let xVelocity = Math.cos(slope);
        let yVelocity = Math.sin(slope);


        let drawDistance = drawDistanceRaw;


        //setting the starting position of the ray
        this.topDownViewCtx.moveTo(SCXpos, SCYpos);

        // console.log("draw distance: " + drawDistance + " and sloe: " + slope);
        //will loop until drawDistance is covered
        for(let r=0; r<drawDistance; r=r+1){

          // yIncrement = (slope * xIncrement) + player1.yPos;
                //will floor the coordinates and target the next pixel in the path (Floor is necessary because the values will be in decimals)

            SCXpos = SCXpos + xVelocity;
            SCYpos = SCYpos + yVelocity;



           // console.log("xIncrement: " + xIncrement);
           // console.log("yIncrement: " + yIncrement);


            let pixelData = this.scanPixel(Math.floor(SCXpos), Math.floor(SCYpos), angleInDegrees);
          //  console.log("pixelData: " + pixelData[0] + " ; " + pixelData[1] + " ; " + pixelData[2] + " ; " + pixelData[3]);
            let finalizedPixelData;

          //>>  console.log("inner method: pixelData[1]extractedColor: " + pixelData[1] + " ; coordinates: " + pixelData[2]);


                    // if it encounters an object, the ray should stop and return the data
                    if(pixelData[0]==true){
                        finalizedPixelData = pixelData;

                        return finalizedPixelData;

                        //  this.renderFPVSinglePixel(finalizedPixelData, this.FPVCtx);
                    }
                    else if(r===drawDistance-5){
                        finalizedPixelData = pixelData;
                        return finalizedPixelData;
                    }

            this.drawRayRepresentation(Math.floor(SCXpos), Math.floor(SCYpos));
        }
       // let data = this.scanPixel(x, y);
    }

    drawSingleRayCustom(angleInDegrees, drawDistanceRaw, color){

        //  console.log("drawSingleRay Activated");



        let slope = convertDegreesToRadians(angleInDegrees);

        //    let fpvScreenSection = this.getFPVScreenSection(slope);

        //SC = scanner particle
        let SCXpos = player1.xPos;
        let SCYpos = player1.yPos;

        let xVelocity = Math.cos(slope);


        let yVelocity = Math.sin(slope);



        let drawDistance = drawDistanceRaw;


        //setting the starting position of the ray
        this.topDownViewCtx.moveTo(SCXpos, SCYpos);

        // console.log("draw distance: " + drawDistance + " and sloe: " + slope);
        //will loop until drawDistance is covered
        for(let r=0; r<drawDistance; r=r+1){

            // yIncrement = (slope * xIncrement) + player1.yPos;
            //will floor the coordinates and target the next pixel in the path (Floor is necessary because the values will be in decimals)

            SCXpos = SCXpos + xVelocity;
            SCYpos = SCYpos + yVelocity;



            // console.log("xIncrement: " + xIncrement);
            // console.log("yIncrement: " + yIncrement);


          //  let pixelData = this.scanPixel(Math.floor(SCXpos), Math.floor(SCYpos));
            //  console.log("pixelData: " + pixelData[0] + " ; " + pixelData[1] + " ; " + pixelData[2] + " ; " + pixelData[3]);
          //  let finalizedPixelData;

            //>>  console.log("inner method: pixelData[1]extractedColor: " + pixelData[1] + " ; coordinates: " + pixelData[2]);


            // if it encounters an object, the ray should stop and return the data
         //   if(pixelData[0]==true){
         //       finalizedPixelData = pixelData;
//
         //       return finalizedPixelData;

                //  this.renderFPVSinglePixel(finalizedPixelData, this.FPVCtx);
          //  }
        //    else if(r==drawDistance-1){
         //       finalizedPixelData = pixelData;
         //       return finalizedPixelData;
           // }

            this.drawRayRepresentationCustom(Math.floor(SCXpos), Math.floor(SCYpos), color);
        }
        // let data = this.scanPixel(x, y);
    }

    //this function will take the coordinates of a pixel and scan it to see if it has an object inside it. Then return an array of data. The array contains info such as objectExists and color
    //the array's first value will be a boolean indicating wheter the space is empty or filled, and then color information
    scanPixel(x, y, currentAngleOfRay){

        //instantiating the necessary variables
        let arrayOfData = []
        let objectDetected;
        let objectDetectedAndNotYellowRay;
        let extractedColor = "";

        let pixelObject = ctx.getImageData(x, y, 1, 1);
        let red = pixelObject.data[0];
        let green = pixelObject.data[1];
        let blue = pixelObject.data[2];

       // console.log("inner scanPixel: red: " + red + " ; blue: " + blue + " ; green: " + green + " ; rotationOrientation: " + this.rotateOrientation);
        extractedColor = "rgb("+ red +", " + green + ", " + blue +")";
        if((red!==0 || green!==0 || blue!==0) && !(red===255 && green===255)){
            objectDetected = true;
            objectDetectedAndNotYellowRay = true;
        }



        if(objectDetected===true && objectDetectedAndNotYellowRay===true){
            extractedColor = "rgb("+ red +", " + green + ", " + blue +")";
            console.log("Real object detected");
        }

        //calculating the distance from the player to the pixel in question. You are assuming a triangle and using Pythagorean theorem to get the distance
        //note you might want to turn the values absolute in case they become negative because of rotation orientation
        let verticalLine = y - this.yPos;
        let horizontalLine = x - this.xPos;

        let distanceFromPlayer = Math.sqrt(Math.pow(verticalLine, 2) + Math.pow(horizontalLine, 2));



        //calculating the distance between the center point ray and its
        let middleAngleInRO = (this.rotateOrientation + this.fieldOfView)/2;
        middleAngleInRO = this.rotateOrientation + (( (this.rotateOrientation + this.fieldOfView) - this.rotateOrientation ) / 2);
        //use law of sines and the distanceFromPlayer to get the side

        let anglex =  middleAngleInRO;
        anglex =  currentAngleOfRay - middleAngleInRO;

        console.log("TEST anglex: " + anglex);


        let angley = 180 - 90 - middleAngleInRO;

    //    console.log("angleX: " + anglex);

        let angleSum = angley + middleAngleInRO + 90;

        anglex = convertDegreesToRadians(anglex);
        angley = convertDegreesToRadians(angley);

    //    console.log("sum of all angles: " + angleSum);
        //purpleLine = ( ( sin(RO+FOV)/2 ) * drawDistance ) / sin anglel1

        let purpleLine = ((Math.sin((this.rotateOrientation + this.fieldOfView)/2)) * this.drawDistance) / Math.sin(anglex);

        //experimental line:
        purpleLine = this.drawDistance / Math.tan(anglex);

        //pythagorean theorem
        //blueLine^2 = drawDistance^2 + purpleLine^2

      //  console.log("CALC: distanceFromPlayer " + distanceFromPlayer);
      //  console.log("CALC: anglex: " + anglex);

        //Note the blueLine is the player facing direction normal distance from the intersection
        let blueLine = Math.sqrt(Math.pow(this.drawDistance, 2) + Math.pow(purpleLine, 2));
      //  console.log("ANGLEX: " + anglex);


        blueLine = distanceFromPlayer * Math.cos(anglex);






        //experimental line below
      //  blueLine = this.drawDistance / Math.sin(angley);



      //  console.log("blueline: " + blueLine);
      //  console.log("purpleLine: " + purpleLine);
      //  console.log("middleAngleInRO: " + middleAngleInRO);
       // this.drawSingleRayCustom(middleAngleInRO, 100, "blue");

        //  Sin(angle1) / MAL = Sin(90) / distanceFromPlayer

       // let middleAngleLine = Math.abs((Math.sin(angle1) * distanceFromPlayer) / Math.sin(90));




        //the following function is an inner helper function simply meant for visualizing the blue nad ppurple lines to make sure
        //the lengths are ok. If an object is detected, it will shoot purple ray


     //   console.log("AngleY: " + angley);
     //   console.log("AngleX: " + anglex);





        arrayOfData[0] = objectDetected;
        arrayOfData[1] = extractedColor;
        arrayOfData[2] = [x, y];
        arrayOfData[3] = distanceFromPlayer;
        arrayOfData[4] = horizontalLine;
        arrayOfData[5] = verticalLine;

        //following data only used for visualization purposes
        arrayOfData[6] = purpleLine;
        arrayOfData[7] = blueLine;





        return arrayOfData;

    }

    //this function provides a visual representation of how the ray is travelling and what pixel it is scanning. Use only for guidance, do not implement into working version because it will interfere with scanPixel
    drawRayRepresentation(xCoord, yCoord){
        this.topDownViewCtx.fillStyle = "yellow";
        this.topDownViewCtx.fillRect(xCoord, yCoord, 1, 1);
    }


    //this function does the same thing as drawRayRepresentation but accepts a color too so you can target individual rays and differentiate them from one another
    drawRayRepresentationCustom(xCoord, yCoord, color){
        this.topDownViewCtx.fillStyle = color;
        this.topDownViewCtx.fillRect(xCoord, yCoord, 1, 1);
    }


    //this function will render the first person view on another canvas completely based on the data it encounters in the top down canvas that shoots the rays. This will solely render one pixel, so use this in loop to render to whole viewport. It is being looped in the rayTrace function since it is being used in
    renderFPVSingleRay(rayData, screenSegmentNumber, screenSegmentWidth, screenSegmentstartingYPos, screenSegmentHeight, customCtx){



        let screenSegmentToRenderXPos = screenSegmentWidth * screenSegmentNumber;

        // you need to figure out how to get the yPos of the segment. It will depend.
        let screenSegmentToRenderYPos = screenSegmentstartingYPos;

        //pixelData structure: 0 = objectDetected (boolean), 1 = objectDistanceFromCamera, 2 = object Color.

        //checking if detectedObject is true
        if(rayData[0]==true){
            let objectPosition = rayData[2];

            //note: you could make a function here that takes in the raw color and returns a modified color to simulate shading. The distance of the object will determine the brightness of the color.
            let objectColor = rayData[1];
            customCtx.fillStyle = objectColor;
            customCtx.fillRect(screenSegmentToRenderXPos, screenSegmentToRenderYPos, screenSegmentWidth, screenSegmentHeight);
        // try inserting a black rectange above the

            /*
            customCtx.fillStyle = "black";
            customCtx.fillRect(screenSegmentToRenderXPos, (screenSegmentstartingYPos - screenSegmentWidth), screenSegmentWidth, (this.FPVCtx.canvas.height - screenSegmentHeight));
        */
        }
        else {
            customCtx.fillStyle = "black";
            customCtx.fillRect(screenSegmentToRenderXPos, screenSegmentToRenderYPos, screenSegmentWidth, screenSegmentHeight);
        }
    }


    //Will take in a slope value and return the screen section of the FPV to which that slope corresponds
    //wiill takeinto account the field of view and divide the screen into sections and get the section
    getFPVScreenSection(){


    }


    //Will split the screen up into segments based on the field of view
   //should return a width and height reading (for now focus on width)
    segmentizeScreen(){

        let dimensionsOfSegment = [0];

        let widthOfSegment = this.FPVCtx.canvas.width / this.fieldOfView;

        let finalizedWidth = (this.FPVCtx.canvas.width) / widthOfSegment;

        console.log("fieldOfview: " + this.fieldOfView);
        console.log("widthOfSegment: " + this.FPVCtx.canvas.width);


        dimensionsOfSegment[0] = widthOfSegment;

        //insert height also once you've implemented the vertical ray tracing

        return dimensionsOfSegment;
    }


    //will take into account the distance of the object from the player and calculate the height
    calculateHeightOfSegment(normalsDistanceFromPlayer){
        let height = this.FPVCtx.canvas.height - (normalsDistanceFromPlayer*1);
        return height;
    }


    //Will take into account the current direction the player is pointed in and make him move forward
    playerMoveForward(){


    }










}

class StaticLight{


    //Light is supposed to be static, so once its instantiated, it's position can't be changed. fieldOfEmission works same as fieldOfView. Intensity should be an integer
    constructor(xPos, yPos, intensity, directionAngle, drawDistance, fieldOfEmission) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.intensity = intensity;
        this.directionAngle = directionAngle;
        this.drawDistance = drawDistance;
        this.fieldOfEmission = fieldOfEmission;
    }

    


}


//global elements

var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext("2d");

// an array of cubes: xPos, yPos, width, height and its color. The brown ones next to each cube represent the outline
var arrayOfCubes = [[100, 100, 50, 20, "blue"], [100, 100, 1, 1, "brown"],[149, 100, 1, 1, "brown"], [149, 119, 1, 1, "brown"],
    [150, 100, 50, 20, "green"],
    [200, 100, 20, 50, "red"],
    [200, 150, 20, 50, "purple"],
    [100, 50, 50, 20, "blue"],
    [150, 50, 50, 20, "orange"],
    [200, 50, 50, 20, "lawngreen"],
    [250, 50, 20, 50, "pink"],
    [200, 300, 50, 10, "purple"], [200, 300, 1, 1, "brown"], [200, 309, 1, 1, "brown"], [249, 309, 1, 1, "brown"], [249, 300, 1, 1, "brown"],
    [250, 310, 50, 20, "green"], [250, 310, 0.5, 0.5, "brown"], [250, 329, 0.5, 0.5, "brown"], [299, 329, 0.5, 0.5, "brown"], [299, 310, 0.5, 0.5, "brown"],
    [335, 310, 70, 20, "red"], [335, 310, 1, 1, "brown"], [335, 329, 1, 1, "brown"], [404, 329, 1, 1, "brown"], [404, 310, 1, 1, "brown"],
    [400, 200, 20, 80, "#0833a1"], [400, 200, 1, 1, "brown"], [400, 279, 1, 1, "brown"], [419, 279, 1, 1, "brown"], [419, 200, 1, 1, "brown"],
    [280, 350, 20, 20, "green"],
    [280, 370, 20, 20, "orange"],
    [280, 390, 20, 20, "green"],
    [280, 330, 20, 20, "orange"],

    [330, 330, 20, 20, "grey"],
    [330, 350, 20, 20, "#363636"],
    [330, 370, 20, 20, "grey"],
    [330, 390, 20, 20, "#363636"],




    ]


;

var player1 = new Player(50, 50, 20, 200, ctx, ctx2, 0);


var gameMapImage = new Image();
gameMapImage.src = 'rayTracerMap1.png';

gameMapImage.crossOrigin = "Anonymous";


gameMapImage.onload = drawLevelMap();









function gameLoop(){

        document.removeEventListener("keydown", listenForKeyInput);

        ctx.clearRect(0, 0, 500, 500);

        console.log("gameloop");

        //  drawBackground();

        drawLevelObjects(arrayOfCubes);
      //  drawLevelMap();


        drawPlayer();



        update();

      //  nonInteractiveRayVisualizer();

      //  nonInteractiveRayVisualizerScopeLines()



}



function drawBackground() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function drawLevelMap(){



ctx.drawImage(gameMapImage, 0, 0);




}


function drawLevelObjects(arrayOfCubes){

   // console.log("drawlevelobjects")

    for(x=0; x<arrayOfCubes.length; x=x+1){
        ctx.fillStyle = arrayOfCubes[x][4];
        ctx.fillRect(arrayOfCubes[x][0], arrayOfCubes[x][1], arrayOfCubes[x][2], arrayOfCubes[x][3]);

    }



}

function drawPlayer(){

  // player1.drawSingleRay(0.1, 300);
    player1.rayTrace();

}


function update(){
    document.addEventListener("keydown", listenForKeyInput)
}
function listenForKeyInput(event){
  //  console.log("wating for keypress");
    let keyCode = event.keyCode;
    switch (keyCode){
        case 39: player1.turnRight(); break;
        case 37: player1.turnLeft(); break;
        case 38: player1.moveForward(); break;
        case 40: player1.moveBackwards(); break;
    }

    gameLoop();
}




function convertDegreesToRadians(degrees){
    let radians = degrees * Math.PI/180;
    return radians;
}

function convertRadiansToDegrees(radians){
    let degrees = radians * 180/Math.PI;
    return degrees;
}



//this function is meant to visualize all the rays that are not the yellow rays. Like the purple and blue line. The idea of having the function
//here is so that the drawing of the rays will not interfere with the shooting of the yellow rays.
//Use the scanPixel function. Just restate all its functions in here to reproduce what its doing with the purple and blue lines.
function nonInteractiveRayVisualizer(){

    //scanpixel code

    let middleAngleInRO = (player1.rotateOrientation + player1.fieldOfView)/2;


    //use law of sines and the distanceFromPlayer to get the side

    let anglex =  middleAngleInRO;

    let angley = 180 - 90 - middleAngleInRO;

   // console.log("angleX: " + anglex);

    let angleSum = angley + middleAngleInRO + 90;

   // console.log("sum of all angles: " + angleSum);
    //purpleLine = ( ( sin(RO+FOV)/2 ) * drawDistance ) / sin anglel1

    let purpleLine = ((Math.sin((player1.rotateOrientation + player1.fieldOfView)/2)) * player1.drawDistance) / Math.sin(anglex);

    //experimental line:
    purpleLine = player1.drawDistance / Math.atan(anglex);

    //pythagorean theorem
    //blueLine^2 = drawDistance^2 + purpleLine^2

    //Note the blueLine is the player facing direction normal distance from the intersection
    let blueLine = Math.sqrt(Math.pow(player1.drawDistance, 2) + Math.pow(purpleLine, 2));

    //experimental line below







    let playerFacingDirection = ((player1.rotateOrientation + player1.fieldOfView) / 2) + player1.rotateOrientation;
        playerFacingDirection = player1.rotateOrientation + (( (player1.rotateOrientation + player1.fieldOfView) - player1.rotateOrientation ) / 2);


    let playerFacingDirectionSlope = convertDegreesToRadians(playerFacingDirection);


    let blueLineXVelocity = Math.cos(playerFacingDirectionSlope);
    let blueLineYVelocity = Math.sin(playerFacingDirectionSlope);

  //  console.log("blueLine X Velocity: " + blueLineXVelocity);
  //  console.log("blueLine Y Velocity: " + blueLineYVelocity);

    let blueXPos = player1.xPos;
    let blueYPos = player1.yPos;


    let blueExperimentalLine = Math.cos(playerFacingDirection) * player1.drawDistance;


    for(let h=0; h<blueExperimentalLine; h=h+1){
        blueXPos = blueXPos + blueLineXVelocity;
        blueYPos = blueYPos + blueLineYVelocity;

        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(Math.floor(blueXPos), Math.floor(blueYPos), 1, 1);

    }


}


function nonInteractiveRayVisualizerScopeLines(){

    let scopeStart = player1.rotateOrientation;
    let scopeEnd = player1.rotateOrientation + player1.fieldOfView + 9;

    let scopeStartSlope = convertDegreesToRadians(scopeStart);
        let scopeStartXVelocity = Math.cos(scopeStartSlope);
        let scopeStartYVelocity = Math.sin(scopeStartSlope);

        let scopeStartBlueXpos = player1.xPos;
        let scopeStartBlueYpos = player1.yPos;

        for(let h=0; h<player1.drawDistance; h=h+1){
            scopeStartBlueXpos = scopeStartBlueXpos + scopeStartXVelocity;
            scopeStartBlueYpos = scopeStartBlueYpos + scopeStartYVelocity;

            this.ctx.fillStyle = "orange";
            this.ctx.fillRect(Math.floor(scopeStartBlueXpos), Math.floor(scopeStartBlueYpos), 1, 1);
        }


    let scopeEndSlope = convertDegreesToRadians(scopeEnd);
    let scopeEndXVelocity = Math.cos(scopeEndSlope);
    let scopeEndYVelocity = Math.sin(scopeEndSlope);

    let scopeEndBlueXpos = player1.xPos;
    let scopeEndBlueYpos = player1.yPos;

    for(let h=0; h<player1.drawDistance; h=h+1){
        scopeEndBlueXpos = scopeEndBlueXpos + scopeEndXVelocity;
        scopeEndBlueYpos = scopeEndBlueYpos + scopeEndYVelocity;

        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(Math.floor(scopeEndBlueXpos), Math.floor(scopeEndBlueYpos), 1, 1);
    }



}


/**
//Reference Points
 playerPosCoords: 75, 294
anglex: 13.5
 YL = 63.38769596696192
 BL = 38.3275357934736
 PL = 166.9730517179344






 yellow line start: 75, 294
 yellow line end: 138, 301

 blue line start:  75, 294
 blue line end:112, 304

 purple line start: 138, 301
 purple line end: 120, 467


 */