"use strict";
/**This function for workflow range simulators*/
import {simulator, createNode, startPoint} from './component.js';
let grid;
(function(){
    /**Create workflow simulators */
    document.querySelector('body').innerHTML = simulator();
    /**next button click event create new object with nodes */
    document.querySelector('#tonext').addEventListener('click',function(){
        /**get values and create Grid */
        grid = new Grid(document.querySelector('#rows').value, document.querySelector('#columns').value, document.querySelector('#obs').value);
    });
    /**after drag and drop start simulation */
    document.querySelector('#simulate').addEventListener('click',function(){
        /**start simulation */        
        grid.addStartPoint();
    });
    document.querySelector('#back').addEventListener('click',function(){
        /**start simulation */        
        location.reload();
    });    
    /**reset event function*/
    document.querySelector('#reset').addEventListener('click',function(){
        grid = new Grid(document.querySelector('#rows').value, document.querySelector('#columns').value, document.querySelector('#obs').value); 
        document.getElementById('simulate').classList.remove("hide");
        document.getElementById('simulate').setAttribute("disabled",true);
        document.getElementById('reset').classList.add("hide");
    });
})();

const Grid = function(rows=1,columns=1,obs=1){
    this.rows = Number(rows);
    this.columns = Number(columns);
    this.obs = obs;
    this.visitedPoint = [];
    this.rightFlowList = [];
    this.rightFlag = false;
    this.nodes = this._buildSimulator();
    this.createSimulatorUI();    
};
/**
 *  Creating object for each cells with some property
 * {isBlocked} - For check the whether cell is blocked (By default is false)
 * {isVisited} - Check node already visited and to avoid looping (By default is false) 
 * @returns nodes object
 */
Grid.prototype._buildSimulator = function(){
    const nodes = new Array(Number(this.rows));
    for( let i=0;i<this.rows+2;i++ ) {
        nodes[i] = new Array(Number(this.columns));
        for(let j=0;j<this.columns;j++) {
            nodes[i][j] = {"isblocked": false,"isVisited":false};    
        }
    }
    return nodes;
};
/**
 * Create SimulatorUI and attach listener for all cells in table
 */
Grid.prototype.createSimulatorUI = function(){
    createNode(this);
    hideElements("simulator","firstpage");
    this.attachListener();
}
Grid.prototype.attachListener = function(){
    attachListener('td',cellClick,'drop'); 
    /* events fired on the draggable target */
document.addEventListener("dragstart", function( event ) {
    grid.dragged = event.target;
    // make it half transparent
    event.target.style.opacity = .5;
}, false);
document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);
/* events fired on the drop targets */
document.addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

}
/**
 * {StartPoint} - To start flow
 * attach listener for starting row
 */
Grid.prototype.addStartPoint = function(){
    // startPoint(this.columns);
    document.querySelector('#start-point').classList.remove('hide');
    attachListener('.start-cell',startPointClick,'click');
}
/**displaying flow of the water with use of VisitedPoint */
Grid.prototype.showFlow = function(){
    const moveEle = grid.visitedPoint;
    const trList = document.querySelector(`#flowTable`).firstChild.childNodes;
    for( let i=0;i<moveEle.length;i++ ){
        trList[moveEle[i][0]].childNodes[moveEle[i][1]].classList.add('path');
    }
    document.getElementById('start-point').classList.remove('hide');
    document.getElementById('simulate').classList.add("hide");
    document.getElementById('reset').classList.remove("hide");
    const listOfTr = document.querySelectorAll('#end-point>.cell');
    for(let i=0;i<listOfTr.length; i++){
        listOfTr[i].classList.remove('hide');
        listOfTr[i].classList.add("white-backgroud");
    }
}
/**
 * @param {Array} graphPoint - add flow nodes to display
 * 
 * @returns 
 */
Grid.prototype.findpath = function(){
    this.nextrow = this.r+1; 
    const graphPoint = [this.r,this.c];  
    grid.visitedPoint.push(graphPoint);
        if(this.rows+2<=this.nextrow){ 
            this.checkFlow(); 
            return false;
        }   
        if(!this.isFlowable()){  
            /**check the block in next node */   
            this.nodes[this.r][this.c].isVisited = true;
            this.r = this.r+1;
            this.findpath();        
        }else{
            if(!this.isNodeVisited()){
                this.checkRightFlow = true;
                this.rightFlowList.push(graphPoint);
                this.isLeftFlowable();
            }else{
                this.isRightFlowable();
            }
            
        }  
}
Grid.prototype.isNodeVisited = function(){
    return this.nodes[this.r][this.c].isVisited;
}
/**Check the adjecent leftside node is is blocked or visited */
Grid.prototype.isLeftFlowable = function(){
   if(this.c>0){
    this.nodes[this.r][this.c].isVisited = true;  
    const movetoLeft = this.c-1;   
    this.c = movetoLeft;
    if(!this.nodes[this.r][this.c].isblocked){
        this.findpath()
    }else{
        this.checkFlow();  
    }       
    }else{
        this.checkFlow();
    }
}
/**Check the adjecent rightside node is is blocked or visited */
Grid.prototype.isRightFlowable = function(){
    if(this.columns>this.c){
        const moveColumn = this.c+1;
        this.c = moveColumn;  
        if(!this.nodes[this.r][this.c].isblocked){
            this.findpath();
        }else{
            this.checkFlow();
        }      
        
     }else{
         this.showFlow();
     }
 }
Grid.prototype.isFlowable = function(){
    const nextrow = this.r+1;
    return this.nodes[nextrow][this.c].isblocked;
}
Grid.prototype.checkFlow = function(){
    if(this.rightFlowList.length){
        this.selectRightSide();
     }else{
         this.showFlow();
     }  
}
Grid.prototype.selectRightSide = function(){
    const firstRight = this.rightFlowList.splice(0,1);
    this.r = firstRight[0][0];
    this.c = firstRight[0][1];
    this.nextrow = this.r;
    this.isRightFlowable();
}
const hideElements = function(removeHide,addHide){
    document.querySelector(`#${removeHide}`).classList.remove('hide');
    document.querySelector(`#${addHide}`).classList.add('hide');
};
const cellClick = function(){
    grid.dragged.style.display = "none";
    grid.dragged.classList.add('moved');
    this.classList.add("blocked");
    const rowIndex = this.parentElement.rowIndex+1;
    const cellIndex = this.cellIndex;
    grid.nodes[rowIndex][cellIndex].isblocked = true;
    document.querySelectorAll('.moved').length == grid.obs && document.getElementById('simulate').removeAttribute('disabled');

}
const startPointClick = function(){
    grid.startPoint= this.cellIndex;
    grid.r = 0;
    grid.c = this.cellIndex;
    document.querySelector('#start-point').classList.add('hide');
    grid.findpath();
    
}

const attachListener=(selector,callback,type)=>{
    const elements = document.querySelectorAll(selector);
    for ( let i=0;i<elements.length;i++ ){
        elements[i].addEventListener(type,callback);    
    }
}
