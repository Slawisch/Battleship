var rows = 10;
var cols = 10;
var squareSize = 50;

// var enemyBoardContainer = document.getElementById("enemyfield");
// var myBoardContainer = document.getElementById("myfield");
// var poolForm = document.getElementById("poolform");
//
// var enemyBoard = GenerateField(enemyBoardContainer);
// var myBoard = GenerateField(myBoardContainer);
// GenerateInputs();

//fillField(enemyBoard);

//enemyBoardContainer.addEventListener("click", fireTorpedo, false);
//myBoardContainer.addEventListener("mousemove", displayShip, false);

function GenerateField(boardContainer, cells){
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {

            var cell = document.createElement("div");
            boardContainer.appendChild(cell);

            cell.id = 'cell' + i + j;

            var topPosition = j * squareSize;
            var leftPosition = i * squareSize;

            cell.style.top = topPosition + 'px';
            cell.style.left = leftPosition + 'px';
            cell.style.width = squareSize + 'px';
            cell.style.height = squareSize + 'px';
            cells.push(cell);
        }
    }
    
}

function GenerateInputs(){
    var inputElement = document.createElement("input");
    poolForm.appendChild(inputElement);
    
    inputElement.type = 'radio';
    inputElement.id = 'ship1';
    
}

function fillField(field){
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            field[i][j] = Math.floor(Math.random() * 2);
            console.log(field[i][j]);
        }
    }
}

function fireTorpedo(e) {
    if (e.target !== e.currentTarget) {
        var row = e.target.id.substring(4,5);
        var col = e.target.id.substring(5,6);
        
        //0 - nothing
        //1 - with ship
        //2 - hit
        //3 - miss
        //4 - tempship
        
        if (enemyBoard[row][col] == 0) {
            e.target.style.background = '#bbb';
            e.target.style.background = '#e5e5e5';
            enemyBoard[row][col] = 3;
            
        } else if (enemyBoard[row][col] == 1) {
            e.target.style.background = 'red';
            enemyBoard[row][col] = 2;
            
            hitCount++;
            if (hitCount == 17) {
                alert("All enemy battleships have been defeated! You win!");
            }
            
        } else if (gameBoard[row][col] > 1) {
            alert("Stop wasting your torpedos! You already fired at this location.");
        }
    }
    e.stopPropagation();
}

function displayShip(e){
    if (e.target !== e.currentTarget) {
        var row = e.target.id.substring(4,5);
        var col = e.target.id.substring(5,6);
        e.target.style.background = '#e5e5e5';
        console.log("f");
    }
    e.stopPropagation();
}



document.addEventListener('DOMContentLoaded', ()=>{
    const userGrid = document.querySelector('.grid-user');
    const aiGrid = document.querySelector('.grid-ai');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const ship40 = document.querySelector('.container40');
    const ship30 = document.querySelector('.container30');
    const ship31 = document.querySelector('.container31');
    const ship20 = document.querySelector('.container20');
    const ship21 = document.querySelector('.container21');
    const ship22 = document.querySelector('.container22');
    const ship10 = document.querySelector('.container10');
    const ship11 = document.querySelector('.container11');
    const ship12 = document.querySelector('.container12');
    const ship13 = document.querySelector('.container13');
    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#turn');
    const infoDisplay = document.querySelector('#info');
    const userCells = [];
    const aiCells = [];
    let isGameOver = false
    let currentPlayer = 'user'
    var isHorizontal = true;
    
    const width = 10;
    
    function createBoard(grid, squares, width){
        for (var i=0; i<width*width; i++){
            const cell = document.createElement('div');
            grid.appendChild(cell);
            squares.push(cell)
        }
    }
    
    GenerateField(userGrid, userCells);
    GenerateField(aiGrid, aiCells);
    
    const shipArray = [
        {
            name: 'ship40',
            directions: [
                [0, 1, 2, 3],
                [0, width, width*2, width*3]
            ]
        },
        {
            name: 'ship30',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'ship31',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'ship20',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'ship21',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'ship22',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'ship10',
            directions: [
                [0],
                [0]
            ]
        },
        {
            name: 'ship11',
            directions: [
                [0],
                [0]
            ]
        },
        {
            name: 'ship12',
            directions: [
                [0],
                [0]
            ]
        },
        {
            name: 'ship13',
            directions: [
                [0],
                [0]
            ]
        }
    ]
    
    function generateShips(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length);
        let current = ship.directions[randomDirection];
        if (randomDirection === 0) direction = 1;
        if (randomDirection === 1) direction = 10;
        let randomStart = Math.abs(Math.floor(Math.random() * aiCells.length - (ship.directions[0].length * direction)));
        
        const isTaken = current.some(index => aiCells[randomStart + index].classList.contains('taken'))
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)
        const isNearShip = isNear(current.map(index => [parseInt(aiCells[randomStart + index].id.substring(4, 5)), parseInt(aiCells[randomStart + index].id.substring(5, 6))]), aiCells)
        
        if(!isTaken && !isAtRightEdge && !isAtLeftEdge && !isNearShip) 
            current.forEach(index => aiCells[randomStart + index].classList.add('taken', ship.name));
        else generateShips(ship);
    }
    
    for (var i=0;i<10;i++){
        generateShips(shipArray[i]);
    }
    
    function rotate(){
        if (isHorizontal) {
            ship40.classList.toggle('container40-v');
            ship30.classList.toggle('container30-v');
            ship31.classList.toggle('container31-v');
            ship20.classList.toggle('container20-v');
            ship21.classList.toggle('container21-v');
            ship22.classList.toggle('container22-v');
            isHorizontal = false;
            console.log(isHorizontal)
        }
        else if (!isHorizontal) {
            ship40.classList.toggle('container40-v');
            ship30.classList.toggle('container30-v');
            ship31.classList.toggle('container31-v');
            ship20.classList.toggle('container20-v');
            ship21.classList.toggle('container21-v');
            ship22.classList.toggle('container22-v');
            isHorizontal = true;
            console.log(isHorizontal)
        }
    }

    rotateButton.addEventListener('click', rotate);

    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userCells.forEach(cell => cell.addEventListener('dragstart', dragStart))
    userCells.forEach(cell => cell.addEventListener('dragover', dragOver))
    userCells.forEach(cell => cell.addEventListener('dragenter', dragEnter))
    userCells.forEach(cell => cell.addEventListener('dragleave', dragLeave))
    userCells.forEach(cell => cell.addEventListener('drop', dragDrop))
    userCells.forEach(cell => cell.addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex
    let draggedShip
    let draggedShipLength

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id
        console.log(selectedShipNameWithIndex)
    }))

    function dragStart() {
        draggedShip = this
        draggedShipLength = this.childNodes[draggedShip.childNodes.length-2].id.substr(-3, 1)
        console.log(draggedShip)
        console.log(draggedShipLength)
    }

    function dragOver(e) {
        e.preventDefault()
    }

    function dragEnter(e) {
        e.preventDefault()
    }

    function dragLeave() {
        console.log('drag leave')
    }

    function dragDrop() {
        let shipNameWithLastId = draggedShip.childNodes[draggedShip.childNodes.length-2].id
        let shipClass = shipNameWithLastId.slice(0, -1)
        console.log(shipClass)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-3, 2))
        console.log(this.id)
        console.log('lastshipindex: ' + lastShipIndex);
        let shipLastId = lastShipIndex + parseInt(this.id.substr(4, 2))
        console.log(shipLastId)

        let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

        //shipLastId = shipLastId - selectedShipIndex
        console.log(shipLastId)
        
        let potentialCells = []
        for (let i=0; i < draggedShipLength; i++) {
            if (isHorizontal)
                potentialCells.push([parseInt(this.id.substring(4, 5)), parseInt(this.id.substring(5, 6)) + i])
            else
                potentialCells.push([parseInt(this.id.substring(4, 5)) + width*i, parseInt(this.id.substring(5, 6))])
        }
        
        console.log(parseInt(this.id))
        
        console.log(isNear(potentialCells, userCells))
        
        if (isHorizontal && !isNear(potentialCells, userCells)) {
            for (let i=0; i < draggedShipLength; i++) {
                userCells[parseInt(this.id.substring(4, 6)) - selectedShipIndex + i].classList.add('taken', 'ship'+shipClass)
                console.log("id: " + this.id.substring(4, 6))
            }
        } else if (!isHorizontal && !isNear(potentialCells, userCells)) {
            for (let i=0; i < draggedShipLength; i++) {
                userCells[parseInt(this.id.substring(4, 6)) - selectedShipIndex + width*i].classList.add('taken', 'ship'+shipClass)
            }
        } else return

        displayGrid.removeChild(draggedShip)
    }

    function isNear(shipCells, fieldCells) {
        const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        var result = []
        var takenCells = fieldCells.filter(item => item.classList.contains('taken')).map(item => [parseInt(item.id.substring(4, 5)), parseInt(item.id.substring(5, 6))])
        takenCells.forEach(function addNearCells(item) {
            result.push([item[0], item[1]])
            result.push([item[0], item[1]+1])
            result.push([item[0]+1, item[1]])
            result.push([item[0]+1, item[1]+1])
            result.push([item[0], item[1]-1])
            result.push([item[0]-1, item[1]])
            result.push([item[0]-1, item[1]-1])
            result.push([item[0]+1, item[1]-1])
            result.push([item[0]-1, item[1]+1])
        })
        
        for(var i=0;i<result.length;i++){
            for(var j=0;j<shipCells.length;j++){
                if(equals(result[i], shipCells[j])){
                    console.log(result[i] + " - " + shipCells[j])
                    return true
                }
                    
            }
        }
        
        return false
    }

    function dragEnd() {
        console.log('dragend')
    }

    
    function playGame() {
        if (isGameOver) return
        if (currentPlayer === 'user') {
            turnDisplay.innerHTML = 'Your Go'
            aiCells.forEach(square => square.addEventListener('click', function(e) {
                revealSquare(square)
            }))
        }
        if (currentPlayer === 'computer') {
            turnDisplay.innerHTML = 'Computers Go'
            computerGo();
        }
    }
    startButton.addEventListener('click', playGame)

    function revealSquare(cell) {
        if (!cell.classList.contains('boom')) {
            if (cell.classList.contains('ship40')) ship40Count++
            if (cell.classList.contains('ship30')) ship30Count++
            if (cell.classList.contains('ship31')) ship31Count++
            if (cell.classList.contains('ship20')) ship20Count++
            if (cell.classList.contains('ship21')) ship21Count++
            if (cell.classList.contains('ship22')) ship22Count++
            if (cell.classList.contains('ship10')) ship10Count++
            if (cell.classList.contains('ship11')) ship11Count++
            if (cell.classList.contains('ship12')) ship12Count++
            if (cell.classList.contains('ship13')) ship13Count++
        }
        if (cell.classList.contains('taken')) {
            cell.classList.add('boom')
        } else {
            cell.classList.add('miss')
        }
        checkForWins()
        currentPlayer = 'computer'
        playGame()
    }

    let ship40Count = 0
    let ship30Count = 0
    let ship31Count = 0
    let ship20Count = 0
    let ship21Count = 0
    let ship22Count = 0
    let ship10Count = 0
    let ship11Count = 0
    let ship12Count = 0
    let ship13Count = 0

    let hitShips = 0;

    var field = new Array(cols);
    for (let i=0;i<cols;i++){
        field[i] = new Array(rows);
    }

    for (let i=0;i<cols;i++){
        for (let j=0;j<rows;j++){
            field[i][j] = 0;
        }
    }
    
    function computerGo() {
        
        let attackIndex = chooseCell(field);

        console.log('hit: ' + hitShips)
        console.log('ai turn-3: ' + attackIndex)
        field[attackIndex[0]][attackIndex[1]] = 1;
        
        if (userCells[parseInt(attackIndex)].classList.contains('ship40')){
            if(aiShip40Count === 0)
                hitShips++;
            aiShip40Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship30')){
            if(aiShip30Count === 0)
                hitShips++;
            aiShip30Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship31')){
            if(aiShip31Count === 0)
                hitShips++;
            aiShip31Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship20')){
            if(aiShip20Count === 0)
                hitShips++;
            aiShip20Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship21')){
            if(aiShip21Count === 0)
                hitShips++;
            aiShip21Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship22')){
            if(aiShip22Count === 0)
                hitShips++;
            aiShip22Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship10')){
            if(aiShip10Count === 0)
                hitShips++;
            aiShip10Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship11')){
            if(aiShip11Count === 0)
                hitShips++;
            aiShip11Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship12')){
            if(aiShip12Count === 0)
                hitShips++;
            aiShip12Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        if (userCells[parseInt(attackIndex)].classList.contains('ship13')){
            if(aiShip13Count === 0)
                hitShips++;
            aiShip13Count++
            field[attackIndex[0]][attackIndex[1]] = 2;
        }
        
        console.log('ai turn-2: ' + attackIndex)
        console.log(field)
        
        if ((userCells[parseInt(attackIndex)].classList.contains('taken'))) {
            (userCells[parseInt(attackIndex)].classList.add('boom'))
        } else {
            (userCells[parseInt(attackIndex)].classList.add('miss'))
        }
        checkForWins()
        currentPlayer = 'user'
        turnDisplay.innerHTML = 'Your Go'
    }
    
    function chooseCell(field) {
        if(hitShips === 0) {
            let x = -1, y = -1;
            while (x == -1 || y == -1){
                let t_x = Math.floor(Math.random() * 10);
                let t_y = Math.floor(Math.random() * 10);
                console.log('ai turn-0: ' + y + x)
                if(field[t_y][t_x] === 0) {
                    x = t_x
                    y = t_y
                    console.log('ai turn-00: ' + y + x)
                }
            }
            console.log('ai turn: ' + y + x)
            return ''+y+x
        }
        else{
            let hitCell = findIndexes(2)
            
            if(hitCell !== undefined){
                let x = -1, y = -1;
                x = parseInt(hitCell[1])
                y = parseInt(hitCell[0])

                if(y-1 >= 0 && field[y-1][x] === 2)
                    if(y+1 < 10 && field[y+1][x] === 0)
                        return ''+(y+1)+(x)
                if(y+1 < 10 && field[y+1][x] === 2)
                    if(y-1 >= 0 && field[y-1][x] === 0)
                        return ''+(y-1)+(x)
                if(x-1 >= 0 && field[y][x-1] === 0)
                    if(x+1 < 10 && field[y][x+1] === 0)
                        return ''+(y)+(x+1)
                if(x+1 < 10 && field[y][x+1] === 0)
                    if(x-1 >= 0 && field[y][x-1] === 0)
                        return ''+(y)+(x-1)
                
                if(y-1 >= 0 && field[y-1][x] === 0)
                    return ''+(y-1)+(x)
                if(y+1 < 10 && field[y+1][x] === 0)
                    return ''+(y+1)+(x)
                if(x-1 >= 0 && field[y][x-1] === 0)
                    return ''+(y)+(x-1)
                if(x+1 < 10 && field[y][x+1] === 0)
                    return ''+(y)+(x+1)
                
                field[y][x] = 3
                return chooseCell(field)
                
            }
        }
    }
    
    function findIndexes(num) {
        for (let i=0;i<cols;i++){
            for (let j=0;j<rows;j++){
                if(field[i][j] === num)
                    return ''+i+j
            }
        }
        return undefined
    }
    
    function fillAround(shipCells, mode) {
        var result = []
        shipCells.forEach(function addNearCells(item) {
            result.push([item[0], item[1]])
            result.push([item[0], item[1]+1])
            result.push([item[0]+1, item[1]])
            result.push([item[0]+1, item[1]+1])
            result.push([item[0], item[1]-1])
            result.push([item[0]-1, item[1]])
            result.push([item[0]-1, item[1]-1])
            result.push([item[0]+1, item[1]-1])
            result.push([item[0]-1, item[1]+1])
        })
        
        result.forEach((item) => {
            console.log(''+item[0]+item[1])
            if(item[0]>=0 && item[0]<10 && item[1]>=0 && item[1]<10 && field[item[0]][item[1]] === 0 && mode) {
                field[item[0]][item[1]] = 1
                userCells[parseInt(''+item[0]+item[1])].classList.add('miss')
            }
            else if(item[0]>=0 && item[0]<10 && item[1]>=0 && item[1]<10 && !mode && !aiCells[parseInt(''+item[0]+item[1])].classList.contains('taken')){
                aiCells[parseInt(''+item[0]+item[1])].classList.add('miss')
            }
        })
    }

    let aiShip40Count = 0
    let aiShip30Count = 0
    let aiShip31Count = 0
    let aiShip20Count = 0
    let aiShip21Count = 0
    let aiShip22Count = 0
    let aiShip10Count = 0
    let aiShip11Count = 0
    let aiShip12Count = 0
    let aiShip13Count = 0
    
    function checkForWins() {
        if (ship40Count === 4) {
            infoDisplay.innerHTML = 'You sunk the computers 4xShip'
            ship40Count = 10
            findCellsAndFillAround('ship40', 'grid-ai-id', false)
        }
        if (ship30Count === 3) {
            infoDisplay.innerHTML = 'You sunk the computers 3xShip'
            ship30Count = 10
            findCellsAndFillAround('ship30', 'grid-ai-id', false)
        }
        if (ship31Count === 3) {
            infoDisplay.innerHTML = 'You sunk the computers 3xShip'
            ship31Count = 10
            findCellsAndFillAround('ship31', 'grid-ai-id', false)
        }
        if (ship20Count === 2) {
            infoDisplay.innerHTML = 'You sunk the computers 2xShip'
            ship20Count = 10
            findCellsAndFillAround('ship20', 'grid-ai-id', false)
        }
        if (ship21Count === 2) {
            infoDisplay.innerHTML = 'You sunk the computers 2xShip'
            ship21Count = 10
            findCellsAndFillAround('ship21', 'grid-ai-id', false)
        }
        if (ship22Count === 2) {
            infoDisplay.innerHTML = 'You sunk the computers 2xShip'
            ship22Count = 10
            findCellsAndFillAround('ship22', 'grid-ai-id', false)
        }
        if (ship10Count === 1) {
            infoDisplay.innerHTML = 'You sunk the computers 1xShip'
            ship10Count = 10
            findCellsAndFillAround('ship10', 'grid-ai-id', false)
        }
        if (ship11Count === 1) {
            infoDisplay.innerHTML = 'You sunk the computers 1xShip'
            ship11Count = 10
            findCellsAndFillAround('ship11', 'grid-ai-id', false)
        }
        if (ship12Count === 1) {
            infoDisplay.innerHTML = 'You sunk the computers 1xShip'
            ship12Count = 10
            findCellsAndFillAround('ship12', 'grid-ai-id', false)
        }
        if (ship13Count === 1) {
            infoDisplay.innerHTML = 'You sunk the computers 1xShip'
            ship13Count = 10
            findCellsAndFillAround('ship13', 'grid-ai-id', false)
        }
        
        function findCellsAndFillAround(shipClass, gridId, mode){
            let cells = document.getElementById(gridId).getElementsByClassName(shipClass)
            let cellIds = Array.prototype.map.call(cells, item => [parseInt(item.id.substring(4, 5)), parseInt(item.id.substring(5, 6))])
            fillAround(cellIds, mode)
        }


        if (aiShip40Count === 4) {
            infoDisplay.innerHTML = 'Your 4xShip has sunk'
            aiShip40Count = 10
            hitShips--
            findCellsAndFillAround('ship40', 'grid-user-id', true)
        }
        if (aiShip30Count === 3) {
            infoDisplay.innerHTML = 'Your 3xShip has sunk'
            aiShip30Count = 10
            hitShips--
            findCellsAndFillAround('ship30', 'grid-user-id', true)
        }
        if (aiShip31Count === 3) {
            infoDisplay.innerHTML = 'Your 3xShip has sunk'
            aiShip31Count = 10
            hitShips--
            findCellsAndFillAround('ship31', 'grid-user-id', true)
        }
        if (aiShip20Count === 2) {
            infoDisplay.innerHTML = 'Your 2xShip has sunk'
            aiShip20Count = 10
            hitShips--
            findCellsAndFillAround('ship20', 'grid-user-id', true)
        }
        if (aiShip21Count === 2) {
            infoDisplay.innerHTML = 'Your 2xShip has sunk'
            aiShip21Count = 10
            hitShips--
            findCellsAndFillAround('ship21', 'grid-user-id', true)
        }
        if (aiShip22Count === 2) {
            infoDisplay.innerHTML = 'Your 2xShip has sunk'
            aiShip22Count = 10
            hitShips--
            findCellsAndFillAround('ship22', 'grid-user-id', true)
        }
        if (aiShip10Count === 1) {
            infoDisplay.innerHTML = 'Your 1xShip has sunk'
            aiShip10Count = 10
            hitShips--
            findCellsAndFillAround('ship10', 'grid-user-id', true)
        }
        if (aiShip11Count === 1) {
            infoDisplay.innerHTML = 'Your 1xShip has sunk'
            aiShip11Count = 10
            hitShips--
            findCellsAndFillAround('ship11', 'grid-user-id', true)
        }
        if (aiShip12Count === 1) {
            infoDisplay.innerHTML = 'Your 1xShip has sunk'
            aiShip12Count = 10
            hitShips--
            findCellsAndFillAround('ship12', 'grid-user-id', true)
        }
        if (aiShip13Count === 1) {
            infoDisplay.innerHTML = 'Your 1xShip has sunk'
            aiShip13Count = 10
            hitShips--
            findCellsAndFillAround('ship13', 'grid-user-id', true)
        }
        
        
        if ((ship40Count + ship30Count + ship31Count + ship20Count + ship21Count + ship22Count + ship10Count + ship11Count + ship12Count + ship13Count) === 100) {
            infoDisplay.innerHTML = "YOU WIN"
            gameOver()
        }
        if ((aiShip40Count + aiShip30Count + aiShip31Count + aiShip20Count + aiShip21Count + aiShip22Count + aiShip10Count + aiShip11Count + aiShip12Count + aiShip13Count) === 100) {
            infoDisplay.innerHTML = "COMPUTER WINS"
            gameOver()
        }
    }

    function gameOver() {
        isGameOver = true
        startButton.removeEventListener('click', playGame)
    }
    
})