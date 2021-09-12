class Cube {



    constructor(xPos, yPos, width, height, color) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.color = color;
    }



    drawCube = function drawCube(xPos, yPos){
       ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    }

}
