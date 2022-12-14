var field, player;

class Field{
    constructor (cols, rows, containerId){
        this.cols = cols;
        this.rows = rows;
        this.container = document.querySelector(containerId);
        this.createFiled();
    }

    createFiled () {
        var field = [];
        for(var i = 0; i < this.rows; i++){
            field[i] = [];
            for (var j = 0; j < this.cols; j++){
                field[i].push(this.createRock());
            }
        }
        this.field = field;
        this.drawField();
    }

    createRock () {
        return Math.trunc(Math.random() * 5) === 1 ? '@' : '';
    }

    drawField () {
        var template = '';
        for(var i = 0; i < this.rows; i++){
            template += '<tr>'; 
            for (var j = 0; j < this.cols; j++){
                template += `<td>${this.field[i][j]}</td>`;
            }
            template += '</tr>';
        }
        this.container.innerHTML = template;
    }
}

class Char {
    constructor (field, x, y, face) {
        this.face = face;
        this.x = x;
        this.y = y;
        this.table = field;
        if (!this.setPosition(x,y)) {
            throw Error();
        }
    }

    setPosition (x, y) {
        if (this.table.field[y][x] === ''){
            this.table.field[this.y][this.x] = '';
            this.x = x;
            this.y = y;
            this.table.field[this.y][this.x] = this.face;
            this.table.drawField();
            return true;
        }
        return false;
    }

    up () {
        if (this.y > 0){
            this.setPosition(this.x, this.y - 1);
        }
    }

    down () {
        if (this.y < this.table.rows - 1){
            this.setPosition(this.x, this.y + 1);
        }
    }

    left () {
        if (this.x > 0) {
            this.setPosition(this.x - 1, this.y);
        }
    }

    right () {
        if (this.x < this.table.cols - 1) {
            this.setPosition(this.x + 1, this.y);
        }
    }
}


class Player extends Char {
    constructor (field) {
        super (field, 0, 0, '0_0');
    }
}

class Npc extends Char {
    constructor (field) {
        var x = Math.trunc(Math.random()*field.cols),
            y = Math.trunc(Math.random()*field.rows);
        
        super (field, x, y, 'X_X');
        setInterval(this.walk.bind(this), 1000);
    }

    walk () {
        var direction = Math.trunc(Math.random() * 4) + 1;
        switch (direction) {
            case 1: this.up(); break;
            case 2: this.down(); break;
            case 3: this.left(); break;
            case 4: this.right(); break; 
        } 
    }
}

function startField () {
    var cols = document.querySelector('#cols').value || 3,
        rows = document.querySelector('#rows').value || 3;

    document.querySelector('button').disabled = true;

    field = new Field(cols, rows, '#myTable');
    try {
        player = new Player (field);
        npc = new Npc (field);
    } catch (e) {
        console.log ('starting field again');
        startField();
    }
}

window.addEventListener('keyup', function (event) {
    if (player) {
        const a = 65,
            s = 83,
            d = 68,
            w = 87;

        switch (event.keyCode) {
            case a: player.left(); break;
            case s: player.down(); break;
            case d: player.right(); break;
            case w: player.up(); break;
        }
    }
})