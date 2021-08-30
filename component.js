
const simulator =()=>{
    return `<section class="main-sec " id="firstpage">
    <header><h1>Water flow Simulator</h1></header>
    <h3>Grid Creation</h3>
    ${inputElement("Number of rows","rows",5)}
    ${inputElement("Number of columns","columns",5)}
    ${inputElement("Number of Obstruction","obs",3)}
    <button type="submit" id="tonext" class="btn">Next</button>
    </section>
    <section id="simulator" class="hide" aria-label="Waterflow simulator Table">
        <header><h1>Workflow Simulator</h1></header>
        <p>Drag the Obs and place it inside the grid</p>
        <div>
        <div class="main"><table id="flowTable" class=""></table>
        <div id="ObsTable" class="blocks"></div>
        </div>
        <div class="button-row">
        <button type="button" id="simulate" class="btn" disabled>Start Simulation</button>
        <button type="button" id="back" class="btn">Back</button>
        <button type="button" id="reset" class="btn hide">Reset</button>
        </div>
    </section>`;
}

const inputElement = (title,id,initial)=>{
    return`<div>
    <div class="input-label">
    <label for="${id}">${title}</label></div>
    <input type="range" id="${id}" min="1" max="10" value="${initial}"> 
    </div>`;
}

const createNode = ($grid)=>{
    let tr="";
    const rows = $grid.rows;
    const columns = $grid.columns;
    for( let i=0;i<rows;i++ ){
        tr=tr+`<tr class="row">${createTd(columns,'cell')}</tr>`;
    }
    tr+=`<tr class="row" id="end-point">${createTd(columns,'cell hide')}</tr>`
    document.querySelector('#flowTable').innerHTML = tr;
    startPoint(columns);    
    createObs($grid.obs);
}
const createObs = function(obs){
    let div = "";
    for( let i=0;i<obs;i++ ){
        div+=`<div class="block-container"><div class="block" draggable="true"></div></div>`;
    }
    document.querySelector('#ObsTable').innerHTML= div;
}
const createTd = (columns,className)=>{
    let td="";
    for( let i=0;i<columns;i++ ){
        td+=`<td class="${className}"></td>`;
    }
    return td;
}
const startPoint = function(columns){
    const tr = document.createElement('tr');
    tr.setAttribute("id","start-point");
    tr.setAttribute("class","hide");
    tr.innerHTML = createTd(columns,'start-cell');
    document.getElementById('flowTable').firstChild.insertBefore(tr,document.getElementById('flowTable').firstChild.childNodes[0]);
}
export {simulator, createNode,startPoint};
