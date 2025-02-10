class TicTacToe {
    static #CURSOR_DISABLED = 'not-allowed';
    static #CURSOR_ENABLED = 'pointer';
    static #DISPLAY_BLOCK = 'block';
    static #DISPLAY_NONE = 'none';
    static #DISPLAY_TABLE = 'table';
    static #ELEMENT_CELL = 'td';
    static #ELEMENT_ROW = 'tr';
    static #HIGHLIGHT = 'lime';
    static #PARAMETER_DIFFICULTY = 'difficulty';
    static #PARAMETER_MODE = 'mode';
    static #PARAMETER_SYMBOL = 'symbol';
    static #SELECTOR_DIFFICULTY = 'select#difficulty';
    static #SELECTOR_FORM = 'form';
    static #SELECTOR_MODE = 'select#mode';
    static #SELECTOR_STATUS = 'p';
    static #SELECTOR_SYMBOL = 'select#symbol';
    static #SELECTOR_TABLE = 'table';
    static #SIZE = 3;

    #mode;
    #difficulty;
    #symbol;
    #cells;
    #turn;
    #timer;

    static main() {
        // TODO turn with getter and setter
        // TODO message constants
        // TODO nbsp
        // TODO table cells constant size
        // TODO refactor using dirs
        TicTacToe.toggleDifficultySymbol();
        const mode = TicTacToe.#getParameter(TicTacToe.#PARAMETER_MODE, Mode);
        const difficulty = TicTacToe.#getParameter(TicTacToe.#PARAMETER_DIFFICULTY, Difficulty);
        const symbol = TicTacToe.#getParameter(TicTacToe.#PARAMETER_SYMBOL, Symbol);
        (mode != null) && (document.querySelector(TicTacToe.#SELECTOR_MODE).value = mode);
        (difficulty != null) && (document.querySelector(TicTacToe.#SELECTOR_DIFFICULTY).value = difficulty);
        (symbol != null) && (document.querySelector(TicTacToe.#SELECTOR_SYMBOL).value = symbol);
        if ((mode != null) && ((mode != Mode.SINGLE_PLAYER) || ((difficulty != null) && (symbol != null)))) {
            new TicTacToe(mode, difficulty, symbol);
        }
    }

    static toggleDifficultySymbol() {
        const twoPlayers = document.querySelector(TicTacToe.#SELECTOR_MODE).value == Mode.TWO_PLAYERS;
        document.querySelector(TicTacToe.#SELECTOR_DIFFICULTY).disabled = twoPlayers;
        document.querySelector(TicTacToe.#SELECTOR_SYMBOL).disabled = twoPlayers;
    }

    static #getParameter(key, enumeration) {
        const value = new URLSearchParams(location.search).get(key);
        return Object.values(enumeration).includes(value) ? value : null;
    }

    constructor(mode, difficulty, symbol) {
        this.#mode = mode;
        this.#difficulty = difficulty;
        this.#symbol = symbol;
        this.#cells = [];
        this.#turn = Symbol.X;
        this.#timer = new Timer();
        document.querySelector(TicTacToe.#SELECTOR_FORM).style.display = TicTacToe.#DISPLAY_NONE;
        const table = document.querySelector(TicTacToe.#SELECTOR_TABLE);
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            this.#cells[i] = [];
            const row = document.createElement(TicTacToe.#ELEMENT_ROW);
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                this.#cells[i][j] = document.createElement(TicTacToe.#ELEMENT_CELL);
                this.#cells[i][j].appendChild(document.createTextNode('*'));
                this.#cells[i][j].style.cursor = TicTacToe.#CURSOR_ENABLED;
                row.appendChild(this.#cells[i][j]);
            }
            table.appendChild(row);
        }
        table.style.display = TicTacToe.#DISPLAY_TABLE;
        document.querySelector(TicTacToe.#SELECTOR_STATUS).style.display = TicTacToe.#DISPLAY_BLOCK;
        this.#playNext();
    }

    #playNext() {
        if ((this.#mode == Mode.TWO_PLAYERS) || (this.#turn == this.#symbol)) {
            this.#enable();
        } else {
            const random = this.#random();
            this.#setSymbol(random.i, random.j);
        }
    }

    #enable() {
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                if (this.#getSymbol(i, j) == null) {
                    this.#cells[i][j].style.cursor = TicTacToe.#CURSOR_ENABLED;
                    this.#cells[i][j].onclick = () => this.#setSymbol(i, j);
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

    #isDraw() {
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                if (this.#getSymbol(i, j) == null) {
                    return false;
                }
            }
        }
        return true;
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
            this.#timer.stop();
            alert(this.#turn + ' won');
        } else if (this.#isDraw()) {
            this.#timer.stop();
            alert('Draw');
        } else {
            this.#turn = (this.#turn == Symbol.X) ? Symbol.O : Symbol.X;
            this.#playNext();
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
