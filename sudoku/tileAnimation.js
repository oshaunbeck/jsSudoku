const columns = 9;
const rows = 9;
const tileWrapper = document.getElementById("tiles");
const choicesWrapper = document.getElementById("choices-container");

const tilesArray = Array.from(Array(9), () => Array.from(Array(9), () => 0));
console.table(tilesArray);
let clicked = true;
let selectedNum = 0;

const fadeElement = (el, start, finish, duration=500) =>{
    anime({
        targets: el,
        opacity: [start, finish],
        duration: duration
    });
}

const animateBgColor = (el, color, duration) => {
    anime({
        targets: el,
        backgroundColor: color,
        duration: duration
    })
}
function animateEl(el, scale, duration, elasticity) {
    anime.remove(el);
    anime({
      targets: el,
      scale: scale,
      duration: duration,
      elasticity: elasticity,
    });
}

function enterEl(el, scale=0.9, duration=800, elasticity=0, index=-1) {
    // dont mess with a click animated tile
    if (clicked) return;

    // Hovering over Selected Choice tile
    if (index != -1 && selectedNum == index + 1) {
        animateEl(el, scale, duration, elasticity);

        return;
    }
    animateEl(el, scale, duration, elasticity);
    anime({
        targets: el,
        backgroundColor: 'rgb(20, 35, 35)',
        duration: 500
    })
}

function leaveEl(el, scale=0.95, duration=600, elasticity=0, index=-1) {
    if (clicked) return;
    if (index != -1 && selectedNum == index + 1) {
        animateEl(el, scale, duration, elasticity);
        return;
    }

    animateEl(el, scale, duration, elasticity);

    anime({
        targets: el,
        backgroundColor: 'rgb(20, 20, 20)',
        duration: 3500
    })
}
function clickTile(el, scale=0.8, duration=600, elasticity=0) {
    anime.remove(el);
    anime({
      targets: el,
      scale: scale,
      duration: duration,
      elasticity: elasticity,
    });
}
function releaseTile(el, scale=0.95, duration=600, elasticity=1000) {
    anime.remove(el);
    anime({
      targets: el,
      scale: scale,
      duration: duration,
      elasticity: elasticity,
    });
}
const handleOnClickBoard = (index, label, tile) => {

    // Placing a number
    if (selectedNum != 0){
        label.innerHTML = selectedNum;
        tile.classList.remove('animate-tile');

        mapBoardToArray(index, selectedNum);
        console.log("Number updated! state of array:")
        console.table(tilesArray)
        return; 
    }

    // Removing a number, therefore animate.
    else{
        label.innerHTML = "";
        tile.classList.add('animate-tile');

        mapBoardToArray(index, 0);
        console.log("Number updated! state of array:")
        console.table(tilesArray)
    }

    clicked = true;
    setTimeout(() => {
        clicked = false;
    }, 1200);
    // Stagger animation through board
    anime({
        targets: ".animate-tile",
        scale: 0.95,
        keyframes: [
            {scale: 0.9},
            {scale: 0.95},
            {backgroundColor: 'rgb(30, 35, 40)'},
            {backgroundColor: 'rgb(20, 20, 20)'}
        ],
        delay: anime.stagger(15, {
            grid: [81, 1],
            from: index
        }),
    });



    

}
const handleOnClickChoice = (index, tile) => {
    clicked = true;
    setTimeout(() => {
        clicked = false;
    }, 600);

    anime({
        targets: ".choice-tile",
        keyframes: [
            {scale: 0.9},
            {scale: 0.95},
        ],
        delay: anime.stagger(25, {
            grid: [9, 1],
            from: index,
            ease: 'cubicBezier(0.8,0,0.2,1)'
        })
    });

    // Deselect
    if (selectedNum == index + 1){
        selectedNum = 0;
        animateBgColor(tile, "rgb(20, 20, 20)", 5000);

    }

    // Select
    else{
        // Deselect previous
        
        // skip if nothing is selected
        if (selectedNum != 0) {

            let prevTile = document.querySelector(`[data-index="${selectedNum-1}"]`);
            animateBgColor(prevTile, "rgb(20, 20, 20)", 5000);
        }

        // select new
        selectedNum = index + 1;
        animateBgColor(tile, "rgb(20, 35, 35)", 500);
    }
}
const mapBoardToArray = (index, num) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    tilesArray[row][col] = num;
}

const createTile = (index, label=false) => {
    const tile = document.createElement('div');

    // Choice tiles
    if (label){

        tile.dataset.index = index;
        tile.classList.add('choice-tile')
        const tileLabel = document.createElement('h1');
        tileLabel.classList.add('choice-label');
        tileLabel.innerHTML = (index %9) + 1;
        tile.appendChild(tileLabel);
        tile.onclick = e => handleOnClickChoice(index, tile);

        tile.addEventListener('mouseenter', function(e) {
            enterEl(e.currentTarget,  0.8, 800, 0, index);
        });
        tile.addEventListener('mouseleave', function(e) {
            leaveEl(e.currentTarget, 0.95, 600, 0, index);
        });
    }

    // Game Tiles
    else{
        tile.classList.add('game-tile');
        tile.classList.add('animate-tile');
        const tileLabel = document.createElement('h1');
        tileLabel.classList.add('cell-label');

        //tileLabel.innerHTML = index;
        tile.appendChild(tileLabel);
        tile.onclick = e => handleOnClickBoard(index, tileLabel, tile);

        tile.addEventListener('mouseenter', function(e) {
            enterEl(e.currentTarget);
        });
        tile.addEventListener('mouseleave', function(e) {
            leaveEl(e.currentTarget);
        });

        tile.addEventListener('mousedown', function(e) {
            clickTile(e.currentTarget);
        });
        tile.addEventListener('mouseup', function(e) {
            releaseTile(e.currentTarget);
        });
    }

    return tile;
}

const createTiles = (quantity, wrapper, label=false) => {
    const blocks = Array.from(Array(9), () => document.createElement('div'));
    blocks.forEach((block, index) => {
        block.classList.add('block');
        block.classList.add(`block-${index}`);
    });

    Array.from(Array(quantity)).map((tile, index) => {
        const tileElement = createTile(index, label);
        const blockIndex = Math.floor(index / 9);
        blocks[blockIndex].appendChild(tileElement);
    });

    blocks.forEach(block => wrapper.appendChild(block));
};

const createChoiceTiles = (wrapper) => {
    Array.from(Array(9)).map((tile, index) =>{
        wrapper.appendChild(createTile(index, true));
    });
}

createTiles(81, tileWrapper);

// animate the tiles in upon load
anime({
    targets: ".animate-tile",
    scale: [0, 0.95],
    easing: "easeOutQuad",
    opacity: [0, 1],
    complete: function(){
        clicked = false;

        // animate in the choice tiles after the board tiles
        anime({
            targets: ".choice-tile",
            scale: [0, 0.9],
            opacity: [0, 1],
            delay: anime.stagger(100)
        })
    },
    delay: anime.stagger(10, {
            grid: [1, 81],
            from: 0
        }),
})

// fade in background of game tiles
anime({
    targets: ".tile-bg",
    opacity: [0, 1],
    import: true,
    easing: "easeInOutQuad",
    duration: 1500
})
createChoiceTiles(choicesWrapper);

// animate in choice tiles

