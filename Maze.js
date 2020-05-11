var cols, rows;
var w = 50;
var grid = [];
var current;
var stack = [];
var gridBtn;

function createGrid() {
    gridBtn = document.getElementById('grid');
    cols = floor(width / w);
    rows = floor(height / w);
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            if (gridBtn.value === "No Grid") {
                let cell = new Cell(i, j, true, true, true, true);
                grid.push(cell);
            } else {
                let cell = new Cell(i, j, false, false, false, false);
                grid.push(cell);
            }
        }
    }
};

function resetGrid() {
    grid = [];
    stack = [];
    createGrid();
    current = grid[0];
}

function setup() {
    createCanvas(600, 600);

    gridBtn = document.getElementById('grid');

    createGrid();
    current = grid[0];
    frameRate(60);

    let size = document.getElementById('diffSelect');
    size.addEventListener('change', () => {
        w = int(size.value);
        resetGrid();
    });

    let speed = document.getElementById('speedSelect');
    speed.addEventListener('change', () => {
        frameRate(int(speed.value));
    })

    let reset = document.getElementById('reset');
    reset.addEventListener('click', () => {
        resetGrid();
    });


    gridBtn.addEventListener('click', () => {
        console.log(gridBtn.value)
        if (gridBtn.value === 'No Grid') {
            gridBtn.value = 'Grid';
            resetGrid();
        } else {
            gridBtn.value = 'No Grid';
            resetGrid();
        }
    });

};

function draw() {
    background(51);
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    current.highlight();
    let next = current.checkNeighbors();
    if (next) {
        drawWalls(current, next);
        current.visited = true;
        stack.push(current);
        next.visited = true;
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
};


function drawWalls(a, b) {
    let x = a.i - b.i; //MoveLeft(1) and MoveRight(-1)
    let y = a.j - b.j; //MoveUp(1) and MoveDown(-1)
    if (x === 1) { //Left
        a.left = false;
        b.right = false;
        b.top = true;
        b.bottom = true;
        b.left = true;
    } else if (x === -1) { // Right
        b.left = false;
        b.top = true;
        b.right = true;
        b.bottom = true;
        a.right = false;
    } //Up and Down
    if (y === 1) { //Up
        a.top = false;
        b.bottom = false;
        b.top = true;
        b.left = true;
        b.right = true;
    } else if (y === -1) { //Down
        a.bottom = false;
        b.top = false;
        b.left = true;
        b.right = true;
        b.bottom = true;
    }
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    };
    return i + j * cols;
}

class Cell {
    constructor(i, j, top = false, right = false, bottom = false, left = false) {
        this.i = i;
        this.j = j;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.visited = false;
    }

    highlight() {
        const x = this.i * w;
        const y = this.j * w;
        noStroke();
        fill(255, 255, 255);
        rect(x, y, w, w);
    }

    checkNeighbors() {
        let i = this.i;
        let j = this.j;
        let neighbors = [];
        let top = grid[index(i, j - 1)];
        let right = grid[index(i + 1, j)];
        let bottom = grid[index(i, j + 1)];
        let left = grid[index(i - 1, j)];
        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            let r = floor(random(0, neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    show() {
        const x = this.i * w;
        const y = this.j * w;
        stroke(255, 255, 255);
        strokeWeight(2);
        if (this.top) {
            line(x, y, x + w, y);
        }
        if (this.right) {
            line(x + w, y, x + w, y + w);
        }
        if (this.bottom) {
            line(x + w, y + w, x, y + w);
        }
        if (this.left) {
            line(x, y + w, x, y);
        }

        if (this.visited) {
            noStroke();
            fill(0, 0, 0);
            rect(x, y, w, w);

        }
    }
}

