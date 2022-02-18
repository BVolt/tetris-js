import {tetOptions} from './shapes.js'


//============================================================================================
//GLOBAL VARIABLES
//============================================================================================
//DOM Objects
const start = document.querySelector('[data-start]')
const pausebtn = document.querySelector('[data-pause]')
const resumebtn = document.querySelector('[data-resume]')
const gameGrid = document.querySelector('.game-grid')
const scoreBox = document.querySelector('.score-box')

//Game variables
const gridBlocks = []
let gameTic = null
let score = 0;

//Drawing variables
let origin = [0,4]
let randomIndex = Math.floor(Math.random()*tetOptions.length)
let tets = tetOptions[randomIndex]
let rotation = 0
let tet = tets[rotation]
let colors = ['1', '2','3','4','5']
let randomColor = Math.floor(Math.random()*colors.length)
let colorCode = colors[randomColor]
//============================================================================================



//============================================================================================
//Create game grid and a two dimensional array referencing DOM nodes
//============================================================================================
const create = () => {
    gameGrid.innerHTML = '';
    for(let r = 0; r < 20; r++ ){
        for(let c = 0; c < 10; c++){
            gameGrid.innerHTML += `<div></div>`
        }
    }

    const nodes = Array.from(document.querySelectorAll('.game-grid div'))
    let i = 0;

    for(let r = 0; r < 20; r++ )
    {  
        gridBlocks[r] = []
        for (let c = 0; c < 10; c++){
            gridBlocks[r][c] = nodes[i]
            i++
        }
    }
    
}

const addDisplacement= (origin, disp) => {
    let y0 = origin[0]
    let x0 = origin[1]
    let y1 = disp[0]
    let x1 = disp[1]
    let newY = y0 + y1
    let newX = x0 + x1

    return [newY,newX]
} 
//============================================================================================



//============================================================================================
//Drawing coordinates and checking if coordinates can be drawn
//============================================================================================
const draw = () => {
    gridBlocks[origin[0] + tet[0][0]][origin[1] +tet[0][1]].classList.add(`v${colorCode}`)
    gridBlocks[origin[0] +tet[1][0]][origin[1]+tet[1][1]].classList.add(`v${colorCode}`)
    gridBlocks[origin[0] +tet[2][0]][origin[1]+tet[2][1]].classList.add(`v${colorCode}`)
    gridBlocks[origin[0] +tet[3][0]][origin[1]+tet[3][1]].classList.add(`v${colorCode}`)
}

const undraw = () =>{
    gridBlocks[origin[0] + tet[0][0]][origin[1] +tet[0][1]].classList.remove(`v${colorCode}`)
    gridBlocks[origin[0] +tet[1][0]][origin[1]+tet[1][1]].classList.remove(`v${colorCode}`)
    gridBlocks[origin[0] +tet[2][0]][origin[1]+tet[2][1]].classList.remove(`v${colorCode}`)
    gridBlocks[origin[0] +tet[3][0]][origin[1]+tet[3][1]].classList.remove(`v${colorCode}`)
}

const checkCoordinates = (origin, tet) =>{
    let clear = true
    const coord = tet.map((disp) => addDisplacement(origin, disp))
    if( coord[0][0] > 19 || coord[1][0] > 19 || coord[2][0] > 19 || coord[3][0] > 19 ||
        coord[0][1] > 9 || coord[1][1] > 9 || coord[2][1] > 9 || coord[3][1] > 9 ||
        coord[0][1] < 0 || coord[1][1] < 0| coord[2][1] < 0|| coord[3][1] < 0 ||
        gridBlocks[coord[0][0]][coord[0][1]].classList.length > 0 ||
        gridBlocks[coord[1][0]][coord[1][1]].classList.length > 0 ||
        gridBlocks[coord[2][0]][coord[2][1]].classList.length > 0 ||
        gridBlocks[coord[3][0]][coord[3][1]].classList.length > 0 
    ){
        clear = false
        return clear
    }else{
        return clear
    }
    
}
//============================================================================================



//============================================================================================
//Game Control Functions
//============================================================================================
const begin = ()=>{
    document.addEventListener('keyup', control)
    draw()
    gameTic = setInterval(() =>moveDown( '1' ), 1000)
    start.removeEventListener('click', begin)
}

const endGame = () => {
    clearInterval(gameTic)
    document.removeEventListener('keyup', control)
    document.body.innerHTML+='<h1 class="game-over">GAME OVER!</h1>'
}

const pause = () =>{
    clearInterval(gameTic)
    document.removeEventListener('keyup', control)
    resumebtn.addEventListener('click', resume)
}

const resume = () =>{
    gameTic = setInterval(() =>moveDown( '1' ), 1000)
    document.addEventListener('keyup', control)
    resumebtn.removeEventListener('click', resume)
}
//============================================================================================



//============================================================================================
//Check Rows, clear, and move them
//============================================================================================
const clearRow =  (row) => {
    for (let c = 0; c < 10; c++){
        const styl = gridBlocks[row][c].classList[0];
        gridBlocks[row][c].classList.remove(styl);
    }
}

const moveRowDown = (row, amount) => {
    for (let c = 0; c < 10; c++){
        if(gridBlocks[row][c].classList[0]){
            const styl = gridBlocks[row][c].classList[0]
            gridBlocks[row][c].classList.remove(styl)
            gridBlocks[row + amount][c].classList.add(styl)
        }
    }
}

const checkRows = () =>{
    let cleared = 0;
    for(let r = 19; r >= 0; r-- )
    {   
        let total = 0
        for (let c = 0; c < 10; c++){
            if(gridBlocks[r][c].classList.length > 0)
            {
                total++
                if(r === 1){
                    endGame()
                }
            }
        }
        if(total > 9){
            clearRow(r)
            cleared++
        }
        else if(total > 0 && cleared > 0){
            moveRowDown(r, cleared)
        }
    }
    switch(cleared){
        case 1:{
            score += 40
            console.log(score)
            break;
        }
        case 2:{
            score += 100
            console.log(score)
            break;
        }
        case 3:{
            score += 300
            console.log(score)
            break;
        }
        case 4:{
            score += 1200
            console.log(score)
            break;
        }
        default:{
            score += 0
            console.log(score)
            break;
        }
    }
    scoreBox.innerHTML = `<h1>Score: ${score}</h1>`
}
//============================================================================================



//============================================================================================
//Shape Movement Functions
//============================================================================================
const moveDown = () => {
    undraw()
    let y = origin[0] 
    let x = origin[1]
    y++
    const check = checkCoordinates([y,x], tet)
    if(!check){
            draw()
            origin = [0,4]
            checkRows()
            randomIndex = Math.floor(Math.random()*tetOptions.length)
            tets = tetOptions[randomIndex]
            tet = tets[rotation]
            randomColor = Math.floor(Math.random()*colors.length)
            colorCode = colors[randomColor]
            return
        }
        else {
        origin=[y, x]
        draw()
    }
}

const moveLeft = () => {
    undraw()
    let y= origin[0] 
    let x = origin[1]
    x--
    const check = checkCoordinates([y,x], tet)
    if(!check){
            draw()
            return
        }
        else {
            origin=[y, x]
            draw()
        }
}
    
const moveRight = () => {
    undraw()
    let y = origin[0] 
    let x = origin[1]
    x++
    const check = checkCoordinates([y,x], tet)
    if(!check){
            draw()
            return
    }
    else {
        origin=[y, x]
        draw()
    }
}

const rotate = () =>{
    undraw()
    if(rotation === 3){
        rotation = 0
    }else{
        rotation++
    }
    const check = checkCoordinates(origin, tets[rotation])
    if(!check){
        rotation--
        draw()
        return
    }
    else{
        tet = tets[rotation]
        draw()
    }
}
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } 
    else if (e.keyCode === 38) {
      rotate()
    } 
    else if (e.keyCode === 39) {
        moveRight()
    } 
    else if (e.keyCode === 40) {
        moveDown()
    }
}
//============================================================================================

create()

start.addEventListener('click', begin)
pausebtn.addEventListener('click', pause)
resumebtn.addEventListener('click', resume)