const columns = 9;
const rows = 9;
const tileWrapper = document.getElementById("tiles");
const choicesWrapper = document.getElementById("num-choices");
let clicked = false;
let selectedNum = 0;

const cellTextFade = anime.timeline({
    targets: '.game-tile',
    easing: 'linear',
  })
    .add({opacity: [1, 0], duration: 500})
    .add({opacity: [0, 1], duration: 500})

function animateEl(el, scale, duration, elasticity) {
    anime.remove(el);
    anime({
      targets: el,
      scale: scale,
      duration: duration,
      elasticity: elasticity,
    });
}

function enterEl(el, scale=0.9, duration=800, elasticity=0) {
    if (clicked) return;
    animateEl(el, scale, duration, elasticity);
    anime({
        targets: el,
        backgroundColor: 'rgb(20, 35, 35)',
        duration: 200
    })
}

function leaveEl(el, scale=0.95, duration=600, elasticity=0) {
    if (clicked) return;
    animateEl(el, scale, duration, elasticity);

    anime({
        targets: el,
        backgroundColor: 'rgb(20, 20, 20)',
        duration: 2500
    })
}
const handleOnClickBoard = (index, el) => {
    clicked = true;
    setTimeout(() => {
        clicked = false;
    }, 1500);
    anime({
        targets: ".game-tile",
        keyframes: [
            {scale: 0.85},
            {backgroundColor: 'rgb(20, 20, 25)'},
            {scale: 0.95},
            {backgroundColor: 'rgb(20, 20, 20)'}
        ],
        delay: anime.stagger(50, {
            grid: [columns, rows],
            from: index
        })
    });

    if (selectedNum != 0){
        cellTextFade.restart();
        setTimeout(() => {
            el.innerHTML = selectedNum;
        }, 100);
        
    }
    else{
        el.innerHTML = "";
    }

}
const handleOnClickChoice = (index) => {
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

    selectedNum = index + 1;
}

const createTile = (index, label=false) => {
    const tile = document.createElement('div');

    
    tile.addEventListener('mouseenter', function(e) {
        enterEl(e.currentTarget);
    });
    tile.addEventListener('mouseleave', function(e) {
        leaveEl(e.currentTarget);
    });
    
    if (label){
        tile.classList.add('choice-tile')
        const tileLabel = document.createElement('h1');
        tileLabel.classList.add('choice-label');
        tileLabel.innerHTML = (index %9) + 1;
        tile.appendChild(tileLabel);
        tile.onclick = e => handleOnClickChoice(index);
    }
    else{
        tile.classList.add('game-tile');
        const tileLabel = document.createElement('h1');
        tileLabel.classList.add('cell-label');
        tile.appendChild(tileLabel);
        tile.onclick = e => handleOnClickBoard(index, tileLabel);
    }

    return tile;
}

const createTiles = (quantity, wrapper, label=false) => {
    Array.from(Array(quantity)).map((tile, index) =>{
        if (label){
            wrapper.appendChild(createTile(index, true));
        }
        else{
            wrapper.appendChild(createTile(index));
        }
    });
}

createTiles(columns * rows, tileWrapper);

createTiles(9, choicesWrapper, true);