class TicTacToe {
    static #CURSOR_DISABLED = 'not-allowed';
    static #CURSOR_ENABLED = 'pointer';
    static #DISPLAY_NONE = 'none';
    static #ELEMENT_CELL = 'td';
    static #ELEMENT_ROW = 'tr';
    static #ELEMENT_TABLE = 'table';
    static #HIGHLIGHT = 'lime';
    static #PARAMETER_DIFFICULTY = 'difficulty';
    static #PARAMETER_MODE = 'mode';
    static #SELECTOR_BODY = 'body';
    static #SELECTOR_DIFFICULTY = 'select#difficulty';
    static #SELECTOR_FORM = 'form';
    static #SELECTOR_MODE = 'select#mode';
    static #SIZE = 3;

    #mode;
    #difficulty;
    #cells;
    #turn;

    static main() {
        TicTacToe.toggleDifficulty();
        const mode = TicTacToe.#getParameter(TicTacToe.#PARAMETER_MODE, Mode);
        const difficulty = TicTacToe.#getParameter(TicTacToe.#PARAMETER_DIFFICULTY, Difficulty);
        (mode != null) && (document.querySelector(TicTacToe.#SELECTOR_MODE).value = mode);
        (difficulty != null) && (document.querySelector(TicTacToe.#SELECTOR_DIFFICULTY).value = difficulty);
        if ((mode != null) && ((mode != Mode.SINGLE_PLAYER) || (difficulty != null))) {
            document.querySelector(TicTacToe.#SELECTOR_FORM).style.display = TicTacToe.#DISPLAY_NONE;
            new TicTacToe(mode, difficulty);
        }
    }

    static toggleDifficulty() {
        const mode = document.querySelector(TicTacToe.#SELECTOR_MODE).value;
        document.querySelector(TicTacToe.#SELECTOR_DIFFICULTY).disabled = (mode == Mode.TWO_PLAYERS);
    }

    static #getParameter(key, enumeration) {
        const value = new URLSearchParams(location.search).get(key);
        return Object.values(enumeration).includes(value) ? value : null;
    }

    constructor(mode, difficulty) {
        this.#mode = mode;
        this.#difficulty = difficulty;
        this.#cells = [];
        this.#turn = Symbol.X;
        const table = document.createElement(TicTacToe.#ELEMENT_TABLE);
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            this.#cells[i] = [];
            const row = document.createElement(TicTacToe.#ELEMENT_ROW);
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                this.#cells[i][j] = document.createElement(TicTacToe.#ELEMENT_CELL);
                this.#cells[i][j].appendChild(document.createTextNode('*'));
                this.#cells[i][j].style.cursor = TicTacToe.#CURSOR_ENABLED;
                this.#cells[i][j].foo = () => {
                    this.#setSymbol(i, j);
                };
                row.appendChild(this.#cells[i][j]);
            }
            table.appendChild(row);
        }
        document.querySelector(TicTacToe.#SELECTOR_BODY).appendChild(table);
        this.#enable();
    }

    #enable() {
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                if (this.#getSymbol(i, j) == null) {
                    this.#cells[i][j].style.cursor = TicTacToe.#CURSOR_ENABLED;
                    this.#cells[i][j].onclick = this.#cells[i][j].foo;
                }
            }
        }
    }

    #disable() {
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                this.#cells[i][j].onclick = null;
                this.#cells[i][j].style.cursor = TicTacToe.#CURSOR_DISABLED;
            }
        }
    }

    #isComplete(row, column, symbol) {
        return this.#isCompleteRow(row, symbol) || this.#isCompleteColumn(column, symbol)
            || this.#isCompleteDiagonal(symbol) || this.#isCompleteAntiDiagonal(symbol);
    }

    #isCompleteRow(row, symbol) {
        const complete = Array.from(Array(TicTacToe.#SIZE).keys())
            .map(i => this.#getSymbol(row, i))
            .filter(s => s == symbol)
            .length == TicTacToe.#SIZE;
        if (complete) {
            Array.from(Array(TicTacToe.#SIZE).keys())
                .forEach(i => this.#highlight(row, i));
        }
        return complete;
    }

    #isCompleteColumn(column, symbol) {
        const complete = Array.from(Array(TicTacToe.#SIZE).keys())
            .map(i => this.#getSymbol(i, column))
            .filter(s => s == symbol)
            .length == TicTacToe.#SIZE;
        if (complete) {
            Array.from(Array(TicTacToe.#SIZE).keys())
                .forEach(i => this.#highlight(i, column));
        }
        return complete;
    }

    #isCompleteDiagonal(symbol) {
        const complete = Array.from(Array(TicTacToe.#SIZE).keys())
            .map(i => this.#getSymbol(i, i))
            .filter(s => s == symbol)
            .length == TicTacToe.#SIZE;
        if (complete) {
            Array.from(Array(TicTacToe.#SIZE).keys())
                .forEach(i => this.#highlight(i, i));
        }
        return complete;
    }

    #isCompleteAntiDiagonal(symbol) {
        const complete = Array.from(Array(TicTacToe.#SIZE).keys())
            .map(i => this.#getSymbol(i, TicTacToe.#SIZE - 1 - i))
            .filter(s => s == symbol)
            .length == TicTacToe.#SIZE;
        if (complete) {
            Array.from(Array(TicTacToe.#SIZE).keys())
                .forEach(i => this.#highlight(i, TicTacToe.#SIZE - 1 - i));
        }
        return complete;
    }

    #getSymbol(row, column) {
        const symbol = this.#cells[row][column].firstChild.nodeValue;
        return Object.values(Symbol).includes(symbol) ? symbol : null;
    }

    #setSymbol(row, column) {
        this.#disable();
        this.#cells[row][column].removeChild(this.#cells[row][column].firstChild);
        this.#cells[row][column].appendChild(document.createTextNode(this.#turn));
        if (this.#isComplete(row, column, this.#turn)) {
            alert(this.#turn + ' won');
        } else {
            this.#turn = (this.#turn == Symbol.X) ? Symbol.O : Symbol.X;
            if ((this.#mode == Mode.TWO_PLAYERS) || (this.#turn == Symbol.X)) {
                this.#enable();
            } else {
                const random = this.#random();
                this.#setSymbol(random.i, random.j);
            }
        }
    }

    #highlight(row, column) {
        this.#cells[row][column].style.backgroundColor = TicTacToe.#HIGHLIGHT;
    }

    #random() {
        const i = Math.floor(Math.random() * TicTacToe.#SIZE);
        const j = Math.floor(Math.random() * TicTacToe.#SIZE);
        return (this.#getSymbol(i, j) == null) ? {i: i, j: j} : this.#random();
    }
}
