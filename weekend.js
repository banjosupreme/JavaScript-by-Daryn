var panelWidth = 11;
var panelHeight = 25;

var input = new KeyboardState();
var blocksize = Math.round(Math.min(0.4*screen.width/panelWidth, 0.85*screen.height/panelHeight));

var midcol = Math.floor(panelWidth/2);



var xloc = [0,0,0,0];
var yloc = [0,0,0,0];

var dropTime = 800;
var pieceColour;

//found this below on stackoverflow
var filled = Array.apply(null, new Array(panelWidth*panelHeight)).map(Number.prototype.valueOf,0);
var panelColours = Array.apply(null, new Array(3)).map(String.prototype.valueOf,"");
var rowCounts = Array.apply(null, new Array(panelHeight)).map(Number.prototype.valueOf,0);

var newBlock = function(x)
{
    var NS = "http://www.w3.org/2000/svg";
    var block = document.createElementNS(NS, "rect");
    block.setAttribute("width",x);
    block.setAttribute("height",x);   
    //console.log(block);
    return block;    
}

var panel = document.getElementById('panel');
panel.setAttribute("width",blocksize*panelWidth);
panel.setAttribute("height",blocksize*panelHeight);
var background = [];

var colourBlock = function(block, colour)
{
    block.style.fill = colour;
    block.style.stroke = "black";
    block.style.opacity = 0.55;    
    //console.log(block);
}

var clearBlock = function(block)
{
    block.style.fill = "#888888";
    block.style.stroke = "#888888";
    block.style.opacity = 1;  
}

var makeBackground = function()
{
    for(var j = 0; j < panelHeight; j++)
    {
        for(var k = 0; k < panelWidth; k++)
        {   
            var block = newBlock(blocksize);
            block.setAttribute("x",k*blocksize);
            block.setAttribute("y",j*blocksize);
            clearBlock(block);
            background.push(block);
            panel.appendChild(background[background.length-1]);
        }
    }   
}

makeBackground();

var colourPiece = function(colour)
{
    colourBlock(sqA,colour);
    colourBlock(sqB,colour);
    colourBlock(sqC,colour);
    colourBlock(sqD,colour);
    pieceColour = colour;
}

var current;

var updateloc = function(xdelta,ydelta)
{
    for(var j = 0; j < 4; j++)
    {
    
        if(xloc[j]+xdelta[j]<0 || xloc[j]+xdelta[j] > panelWidth -1 || yloc[j]+ydelta[j] < 0 || yloc[j]+ydelta[j] > panelHeight -1)
        {
            return false;
        }
        if (filled[index(xloc[j]+xdelta[j], yloc[j]+ydelta[j])]==1)
        {
            return false;
        }
        
    }
    for(var j = 0; j < 4; j++)
    {
        xloc[j]+=xdelta[j];
        yloc[j]+=ydelta[j];
    }
    setPieceFromxandy();

    return true;
}
var index = function(x,y)
{
    return y*panelWidth+x;
}
var arrayMin = function(inArray)
{
    var outVal = inArray[0];
    for(var j = 1; j < inArray.length; j++)
    {
        if(inArray[j]<outVal)
        {
            outVal = inArray[j];
        }
    }
    return outVal;
}
var arrayMax = function(inArray)
{
    var outVal = inArray[0];
    for(var j = 1; j < inArray.length; j++)
    {
        if(inArray[j]>outVal)
        {
            outVal = inArray[j];
        }
    }
    return outVal;
}

var canMoveDown = function()
{
    if (arrayMax(yloc) >= (panelHeight-1))
    {
        return false;
    }
    else if (filled[index(xloc[0],yloc[0]+1)]==1 || filled[index(xloc[1],yloc[1]+1)]==1 || filled[index(xloc[2],yloc[2]+1)]==1 || filled[index(xloc[3],yloc[3]+1)]==1)
    {
        return false;
    }
    return true;
}
var canMoveLeft = function()
{   
    if (arrayMin(xloc)<=0)
    {
        return false;
    }
    else if (filled[index(xloc[0]-1,yloc[0])]==1 || filled[index(xloc[1]-1,yloc[1])]==1 || filled[index(xloc[2]-1,yloc[2])]==1 || filled[index(xloc[3]-1,yloc[3])]==1)
    {
        return false;
    }
    return true;
}
var canMoveRight = function()
{   
    if (arrayMax(xloc)>= (panelWidth-1))
    {
        return false;
    }
    else if (filled[index(xloc[0]+1,yloc[0])]==1 || filled[index(xloc[1]+1,yloc[1])]==1 || filled[index(xloc[2]+1,yloc[2])]==1 || filled[index(xloc[3]+1,yloc[3])]==1)
    {
        return false;
    }
    return true;
}


var setPieceFromxandy = function()
{
    sqA.x.baseVal.value = xloc[0]*blocksize;
    sqA.y.baseVal.value = yloc[0]*blocksize;
    sqB.x.baseVal.value = xloc[1]*blocksize;
    sqB.y.baseVal.value = yloc[1]*blocksize;
    sqC.x.baseVal.value = xloc[2]*blocksize;
    sqC.y.baseVal.value = yloc[2]*blocksize;
    sqD.x.baseVal.value = xloc[3]*blocksize;
    sqD.y.baseVal.value = yloc[3]*blocksize;
}

var Type1 = function()
{
    this.position = 0;
    this.makeNew = function()
    {
        xloc = [(midcol-1),midcol,midcol,(midcol+1)];
        yloc = [2,2,3,3];
        setPieceFromxandy();        
        colourPiece("#1f77b4");     
    }
    
    this.turn = function()
    {
        var flag = false;
        if (this.position == 0)
        {

            flag = updateloc([0,-1,0,-1],[2,1,0,-1]);

        }
        else if (this.position ==1)
        {
            flag = updateloc([0,1,0,1],[-2,-1,0,1]);            
        }
        
        if (flag)
        {
            this.position = (this.position+1)%2;
        }
          
    }    
    this.turnLeft = function()
    {
        this.turn();    
    }    
    this.turnRight = function()
    {
        this.turn();    
    }

    
}

var Type2 = function()
{
    this.position = 0;
    this.makeNew = function()
    {
        xloc = [(midcol+1),midcol,midcol,(midcol-1)];
        yloc = [2,2,3,3];
        setPieceFromxandy(); 
        colourPiece("#ff7f0e");         
    }    
    this.turn = function()
    {        
        var flag = false;
        if (this.position == 0)
        {   
                flag = updateloc([0,1,0,1],[2,1,0,-1]);
        }
        else if(this.position == 1)
        {
            flag = updateloc([0,-1,0,-1],[-2,-1,0,1]);
        }
        if (flag)
        {
            this.position = (this.position+1)%2;
        }
        
    }    
    this.turnLeft = function()
    {
        this.turn();
    }
    this.turnRight = function()
    {
        this.turn();
    }    
}


var Type3 = function()
{
    this.position = 0;
    this.makeNew = function()
    {
        xloc = [(midcol-1),midcol,midcol,(midcol+1)];
        yloc = [3,2,3,3];
        setPieceFromxandy(); 
        colourPiece("#ff0000");         
    }    
    this.turnLeft = function()
    {      
        var flag = false;
        if (this.position == 0)
        {   
            flag = updateloc([1,-1,0,-1],[1,1,0,-1]);
        }
        else if(this.position == 1)
        {
            flag = updateloc([1,1,0,-1],[-1,1,0,1]);
        }
        else if (this.position == 2)
        {
            flag = updateloc([-1,1,0,1],[-1,-1,0,1]);    
        }
        else if (this.position == 3)
        {
            flag = updateloc([-1,-1,0,1],[1,-1,0,-1]);
        }
        if (flag)
        {
            this.position = (this.position+1)%4;    
        }
    }    
    this.turnRight = function()
    {   
        var flag = false;
        if (this.position == 1)
        {   
            flag = updateloc([-1,1,0,1],[-1,-1,0,1]);

        }
        else if(this.position == 2)
        {
            flag = updateloc([-1,-1,0,1],[1,-1,0,-1]);
        }
        else if (this.position == 3)
        {
            flag = updateloc([1,-1,0,-1],[1,1,0,-1]);
        }
        else if (this.position == 0)
        {
            flag = updateloc([1,1,0,-1],[-1,1,0,1]);
        }
        if (flag)
        {
            this.position = (this.position+3)%4;   
        }
    }
    
}
var Type4 = function()
{
    this.position = 0;
    this.makeNew = function()
    {
        xloc = [(midcol-1),(midcol),(midcol+1),(midcol+1)];
        yloc = [3,3,3,2];
        setPieceFromxandy(); 
        colourPiece("#ffff33");         
    }
    
    this.turnLeft = function()
    {
        var flag = false;
        console.log(this.position);
        if (this.position == 0)
        {
            flag = updateloc([2,1,0,-1],[2,1,0,1]);
        }
        else if (this.position == 1)
        {
            flag = updateloc([2,1,0,1],[-2,-1,0,1]);
        }
        else if (this.position == 2)
        {
            flag = updateloc([-2,-1,0,1],[-2,-1,0,-1]);
        }
        else if (this.position == 3)
        {
            flag = updateloc([-2,-1,0,-1],[2,1,0,-1]);
        }
        if(flag)
        {
            this.position = (this.position+1)%4;
        }
        
    }
    
    this.turnRight = function()
    {
        var flag = false;
        if (this.position == 1)
        {
            flag = updateloc([-2,-1,0,1],[-2,-1,0,-1]);
        }
        else if (this.position == 2)
        {
            flag = updateloc([-2,-1,0,-1],[2,1,0,-1]);
        }
        else if (this.position == 3)
        {
            flag = updateloc([2,1,0,-1],[2,1,0,1]);
        }
        else if (this.position == 0)
        {
            flag = updateloc([2,1,0,1],[-2,-1,0,1]);
        }
        if (flag)
        {
            this.position = (this.position+3)%4;
        }
    }
}

var Type5 = function()
{
    this.position = 0;
    this.makeNew = function()
    {
        xloc = [(midcol+1),midcol,(midcol-1),(midcol-1)];
        yloc = [3,3,3,2];
        setPieceFromxandy(); 
        colourPiece("#cc33ff");          
    }
    
    this.turnLeft = function()
    {
        var flag = false;
            if (this.position == 0)
            {
                flag = updateloc([-2,-1,0,-1],[-2,-1,0,1]);
            }
            else if (this.position == 1)
            {
                flag = updateloc([-2,-1,0,1],[2,1,0,1]);
            }
            else if (this.position == 2)
            {
                flag = updateloc([2,1,0,1],[2,1,0,-1]);
            }
            else if (this.position == 3)
            {
                flag = updateloc([2,1,0,-1],[-2,-1,0,-1]);
            }
            if (flag)
            {
                this.position = (this.position+1)%4;
            }
    }
    
    this.turnRight = function()
    {
        var flag = false;
            if (this.position == 1)
            {
                flag = updateloc([2,1,0,1],[2,1,0,-1]);
            }
            else if (this.position == 2)
            {
                flag = updateloc([2,1,0,-1],[-2,-1,0,-1]);
            }
            else if (this.position == 3)
            {
                flag = updateloc([-2,-1,0,-1],[-2,-1,0,1]);
            }
            else if (this.position == 0)
            {
                flag = updateloc([-2,-1,0,1],[2,1,0,1]);
            }
            if (flag)
            {
                this.position = (this.position+3)%4;
            }
    }
}

var Type6 = function()
{    
    this.makeNew = function()
    {
        xloc = [(midcol-1),(midcol-1),midcol,midcol];
        yloc = [2,3,2,3];
        setPieceFromxandy(); 
        colourPiece("#00bfff");          
    }
    
    this.turnLeft = function(){}
    this.turnRight = function(){}
}

    
var Type7 = function()
{    
    this.position = 0;
    this.makeNew = function()
    {
        xloc = [midcol,midcol,midcol,midcol];
        yloc = [0,1,2,3];
        setPieceFromxandy(); 
        colourPiece("#ff00bf");          
    }
    
    this.turn = function()
    {
        var flag = false;
        if (this.position == 0)
        {

            flag = updateloc([-2,-1,0,1],[2,1,0,-1]);

        }
        else if (this.position ==1)
        {
            flag = updateloc([2,1,0,-1],[-2,-1,0,1]);            
        }
        
        if (flag)
        {
            this.position = (this.position+1)%2;
        }
          
    }

    this.turnLeft = function()
    {
        this.turn();
    }
    this.turnRight = function()
    {
        this.turn();
    }  
    
    
    
}

sqA = newBlock(blocksize);
sqB = newBlock(blocksize);
sqC = newBlock(blocksize);
sqD = newBlock(blocksize);

var movePiece = function(xmove, ymove)
{
    sqA.x.baseVal.value += xmove;
    sqA.y.baseVal.value += ymove;
    sqB.x.baseVal.value += xmove;
    sqB.y.baseVal.value += ymove;
    sqC.x.baseVal.value += xmove;
    sqC.y.baseVal.value += ymove;
    sqD.x.baseVal.value += xmove;
    sqD.y.baseVal.value += ymove;
}


var makeNewPiece = function()
{
    var whichPiece = Math.random();

    if (whichPiece < 0.17)
    {
        current = new Type1();
    }
    else if (whichPiece < 0.34)
    {
        current = new Type2();
    }
    else if (whichPiece < 0.51)
    {
        current = new Type3();            
    }
    else if (whichPiece < 0.68)
    {
        current = new Type4();            
    }
    else if (whichPiece < 0.85)
    {
        current = new Type5();
    }
    else if (whichPiece < 0.95 )
    {
        current = new Type6();
    }
    else 
    {
        current = new Type7();
    }        
    current.makeNew();
}

makeNewPiece();
document.getElementById('panel').appendChild(sqA);
document.getElementById('panel').appendChild(sqB);
document.getElementById('panel').appendChild(sqC);
document.getElementById('panel').appendChild(sqD);


var updatePanel = function()
{
    var rowsMade = 0;
    for(var j = panelHeight-1;j>=0;j--)
    {
        if(rowCounts[j]==panelWidth)
        {
            rowsMade+=1;
        }
        else if (rowsMade > 0)
        {
            for (var k = 0; k < panelWidth; k++)
            {
                var tempIndex = index(k,j);
                filled[tempIndex+(rowsMade*panelWidth)] = filled[tempIndex];
                panelColours[tempIndex+(rowsMade*panelWidth)] = panelColours[tempIndex];
                if(filled[tempIndex]==1)
                {
                    colourBlock(background[tempIndex+(rowsMade*panelWidth)], panelColours[tempIndex]);
                }
                else
                {
                    clearBlock(background[tempIndex+(rowsMade*panelWidth)]);
                }
                
            }
            
            rowCounts[j+rowsMade]=rowCounts[j];
        
        }
    }
}


var dropAllWay = function()
{
    while(canMoveDown())
    {
        updateloc([0,0,0,0],[1,1,1,1]);
    }
}


var dropPiece = function()
{
    if (rowCounts[3]>0)
    {
        filled = Array.apply(null, new Array(panelWidth*panelHeight)).map(Number.prototype.valueOf,0);
        panelColours = Array.apply(null, new Array(3)).map(String.prototype.valueOf,"");
        rowCounts = Array.apply(null, new Array(panelHeight)).map(Number.prototype.valueOf,0);
        
        for(var j = panelHeight-1;j>=0;j--)
        {
            for (var k = 0; k < panelWidth; k++)
            {
                var tempIndex = index(k,j);
                clearBlock(background[tempIndex]);
            }
         }
        
        makeNewPiece();
    
    }

    if(canMoveDown())
    {
        updateloc([0,0,0,0],[1,1,1,1]);
    }
    
    else
    {   
        var flag = false;
        var tempIndex;
        for(var j=0;j<4;j++)
        {
            tempIndex = index(xloc[j],yloc[j]);
            rowCounts[yloc[j]]+=1;
            if(rowCounts[yloc[j]]==panelWidth)
            {
                flag = true;
            }
            colourBlock(background[tempIndex], pieceColour);
            filled[tempIndex]=1;
            panelColours[tempIndex] = pieceColour;
        }
        
        if (flag == true)
        {
            updatePanel();
        }
        makeNewPiece();

    }
    
}

var handleInput = function()
{
    input.update();
    
    if (input.down("left"))
    {
        if (canMoveLeft())
        {
            updateloc([-1,-1,-1,-1],[0,0,0,0]);
        }
    }
    else if (input.down("right"))
    {    
        if (canMoveRight())
        {
            updateloc([1,1,1,1],[0,0,0,0]);        
        }
	}
    else if (input.down("down"))
    {
        if (canMoveDown())
        {
            updateloc([0,0,0,0],[1,1,1,1]);
        }
    }
    else if (input.down("Z"))
    {    
		    current.turnLeft();
	}
    else if (input.down("X"))
    {    
		    current.turnRight();
	}
    else if(input.down("space"))
    {
        dropAllWay();
    }
}
         
setInterval(dropPiece, dropTime);
setInterval(handleInput,10);


