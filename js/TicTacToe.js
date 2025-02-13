class TicTacToe {
    static #CURSOR_DISABLED = 'not-allowed';
    static #CURSOR_ENABLED = 'pointer';
    static #DISPLAY_BLOCK = 'block';
    static #DISPLAY_NONE = 'none';
    static #DISPLAY_TABLE = 'table';
    static #ELEMENT_CELL = 'td';
    static #ELEMENT_ROW = 'tr';
    static #HIGHLIGHT = 'lime';
    static #MESSAGE_DRAW = 'It\'s a draw!';
    static #MESSAGE_TURN = (mode, symbol, turn) => (mode == Mode.SINGLE_PLAYER)
            ? ((turn == symbol) ? `You (${turn})` : `Computer (${turn})`)
            : ((turn == Symbol.X) ? `Player 1 (${turn})` : `Player 2 (${turn})`);
    static #MESSAGE_WIN = (mode, symbol, turn) => (mode == Mode.SINGLE_PLAYER)
            ? ((turn == symbol) ? `You (${turn}) win!` : `Computer (${turn}) wins!`)
            : ((turn == Symbol.X) ? `Player 1 (${turn}) wins!` : `Player 2 (${turn}) wins!`);
    static #PARAMETER_DIFFICULTY = 'difficulty';
    static #PARAMETER_MODE = 'mode';
    static #PARAMETER_SYMBOL = 'symbol';
    static #PATTERN_TURN = /^.+\((X|O)\)$/;
    static #SELECTOR_DIFFICULTY = 'select#difficulty';
    static #SELECTOR_FORM = 'form';
    static #SELECTOR_MODE = 'select#mode';
    static #SELECTOR_STATUS = 'p';
    static #SELECTOR_SYMBOL = 'select#symbol';
    static #SELECTOR_TABLE = 'table';
    static #SELECTOR_TURN = 'span:nth-of-type(1)';
    static #SIZE = 3;

    #mode;
    #difficulty;
    #symbol;
    #cells;
    #timer;

    static main() {
        // TODO difficult (alpha beta)
        // TODO start over
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
                this.#cells[i][j].style.cursor = TicTacToe.#CURSOR_ENABLED;
                row.appendChild(this.#cells[i][j]);
            }
            table.appendChild(row);
        }
        table.style.display = TicTacToe.#DISPLAY_TABLE;
        document.querySelector(TicTacToe.#SELECTOR_STATUS).style.display = TicTacToe.#DISPLAY_BLOCK;
        this.#playNext();
    }

    get #symbols() {
        const symbols = [];
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            symbols[i] = [];
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                symbols[i][j] = this.#getSymbol(i, j);
            }
        }
        return symbols;
    }

    get #turn() {
        return document.querySelector(TicTacToe.#SELECTOR_TURN).firstChild.nodeValue.match(TicTacToe.#PATTERN_TURN)[1];
    }

    set #turn(turn) {
        const element = document.querySelector(TicTacToe.#SELECTOR_TURN);
        element.firstChild && element.removeChild(element.firstChild);
        element.appendChild(document.createTextNode(TicTacToe.#MESSAGE_TURN(this.#mode, this.#symbol, turn)));
    }

    #playNext() {
        if ((this.#mode == Mode.TWO_PLAYERS) || (this.#turn == this.#symbol)) {
            this.#enable();
        } else {
            const next = (this.#difficulty == Difficulty.EASY)
                ? this.#random()
                // TODO
                : this.#alphaBeta(this.#symbols, -Infinity, Infinity, 0, this.#turn);
//                : this.#minimax(this.#symbols, this.#turn);
            this.#setSymbol(next.row, next.column);
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

    #getSymbol(row, column) {
        const symbol = this.#cells[row][column]?.firstChild?.nodeValue;
        return Object.values(Symbol).includes(symbol) ? symbol : null;
    }

    #setSymbol(row, column) {
        this.#disable();
        this.#cells[row][column].firstChild && this.#cells[row][column].removeChild(this.#cells[row][column].firstChild);
        this.#cells[row][column].appendChild(document.createTextNode(this.#turn));
        const win = this.#isWin(this.#symbols, true);
        if (win != null) {
            this.#timer.stop();
            alert(TicTacToe.#MESSAGE_WIN(this.#mode, this.#symbol, this.#turn));
        } else if (this.#isDraw(this.#symbols)) {
            this.#timer.stop();
            alert(TicTacToe.#MESSAGE_DRAW);
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
        return (this.#getSymbol(i, j) == null) ? {row: i, column: j} : this.#random();
    }

    // https://xkcd.com/832/
    #alphaBeta(ticTacToe, a, b, depth, turn) {
        const win = this.#isWin(ticTacToe, false);
        if (win != null) {
            return {row: null, column: null, depth: depth, value: (win == Symbol.X) ? Infinity : -Infinity};
        }
        if (this.#isDraw(ticTacToe)) {
            return {row: null, column: null, depth: depth, value: 0};
        }
        let row = null;
        let column = null;
        let d = null;
        let value = null;
        if (turn == Symbol.X) {
            d = Infinity;
            value = -Infinity;
            for (let child of this.#children(ticTacToe)) {
                const newTicTacToe = JSON.parse(JSON.stringify(ticTacToe));
                newTicTacToe[child.row][child.column] = Symbol.X;
                const newAlphaBeta = this.#alphaBeta(newTicTacToe, a, b, depth + 1, Symbol.O);
                if ((newAlphaBeta.value > value) || ((newAlphaBeta.value == value) && (newAlphaBeta.depth < d))) {
                    row = child.row;
                    column = child.column;
                    d = newAlphaBeta.depth;
                    value = newAlphaBeta.value;
                }
//                a = Math.max(a, value);
//                if (value >= b) {
//                    break;
//                }
            }
            return {row: row, column: column, depth: d, value: value};
        } else {
            d = Infinity;
            value = Infinity;
            for (let child of this.#children(ticTacToe)) {
                const newTicTacToe = JSON.parse(JSON.stringify(ticTacToe));
                newTicTacToe[child.row][child.column] = Symbol.O;
                const newAlphaBeta = this.#alphaBeta(newTicTacToe, a, b, depth + 1, Symbol.X);
                if ((newAlphaBeta.value < value) || ((newAlphaBeta.value == value) && (newAlphaBeta.depth < d))) {
                    row = child.row;
                    column = child.column;
                    d = newAlphaBeta.depth;
                    value = newAlphaBeta.value;
                }
//                b = Math.min(b, value);
//                if (value <= a) {
//                    break;
//                }
            }
            return {row: row, column: column, depth: d, value: value};
        }
    }

    #isWin(ticTacToe, highlight) {
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            const winRow = this.#isWinRow(ticTacToe, i);
            if (winRow != null) {
                highlight && Array.from(Array(TicTacToe.#SIZE).keys())
                    .forEach(j => this.#highlight(i, j));
                return winRow;
            }
            const winColumn = this.#isWinColumn(ticTacToe, i);
            if (winColumn != null) {
                highlight && Array.from(Array(TicTacToe.#SIZE).keys())
                    .forEach(j => this.#highlight(j, i));
                return winColumn;
            }
        }
        const winDiagonal = this.#isWinDiagonal(ticTacToe);
        if (winDiagonal != null) {
            highlight && Array.from(Array(TicTacToe.#SIZE).keys())
                .forEach(i => this.#highlight(i, i));
            return winDiagonal;
        }
        const winAntiDiagonal = this.#isWinAntiDiagonal(ticTacToe);
        if (winAntiDiagonal != null) {
            highlight && Array.from(Array(TicTacToe.#SIZE).keys())
                .forEach(i => this.#highlight(i, TicTacToe.#SIZE - 1 - i));
            return winAntiDiagonal;
        }
        return null;
    }

    #isWinRow(ticTacToe, row) {
        for (let j = 1; j < TicTacToe.#SIZE; j++) {
            if (ticTacToe[row][j] != ticTacToe[row][0]) {
                return null;
            }
        }
        return ticTacToe[row][0];
    }

    #isWinColumn(ticTacToe, column) {
        for (let i = 1; i < TicTacToe.#SIZE; i++) {
            if (ticTacToe[i][column] != ticTacToe[0][column]) {
                return null;
            }
        }
        return ticTacToe[0][column];
    }

    #isWinDiagonal(ticTacToe) {
        for (let i = 1; i < TicTacToe.#SIZE; i++) {
            if (ticTacToe[i][i] != ticTacToe[0][0]) {
                return null;
            }
        }
        return ticTacToe[0][0];
    }

    #isWinAntiDiagonal(ticTacToe) {
        for (let i = 1; i < TicTacToe.#SIZE; i++) {
            if (ticTacToe[i][TicTacToe.#SIZE - 1 - i] != ticTacToe[0][TicTacToe.#SIZE - 1]) {
                return null;
            }
        }
        return ticTacToe[0][TicTacToe.#SIZE - 1]
    }

    #isDraw(ticTacToe) {
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                if (ticTacToe[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    #children(ticTacToe) {
        const children = [];
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                if (ticTacToe[i][j] == null) {
                    children.push({row: i, column: j});
                }
            }
        }
        return children;
    }

    #minimax(ticTacToe, turn) {
        const win = this.#isWin(ticTacToe, false);
        if (win != null) {
            return {row: null, column: null, value: (win == Symbol.X) ? Infinity : -Infinity};
        }
        if (this.#isDraw(ticTacToe)) {
            return {row: null, column: null, value: 0};
        }
        let row = null;
        let column = null;
        let value = null;
        if (turn == Symbol.X) {
            value = -Infinity;
            for (let child of this.#children(ticTacToe)) {
                const newTicTacToe = JSON.parse(JSON.stringify(ticTacToe));
                newTicTacToe[child.row][child.column] = Symbol.X;
                const newMinimax = this.#minimax(newTicTacToe, Symbol.O);
                if (newMinimax.value > value) {
                    row = child.row;
                    column = child.column;
                    value = newMinimax.value;
                }
            }
            return {row: row, column: column, value: value};
        } else {
            value = Infinity;
            for (let child of this.#children(ticTacToe)) {
                const newTicTacToe = JSON.parse(JSON.stringify(ticTacToe));
                newTicTacToe[child.row][child.column] = Symbol.O;
                const newMinimax = this.#minimax(newTicTacToe, Symbol.X);
                if (newMinimax.value < value) {
                    row = child.row;
                    column = child.column;
                    value = newMinimax.value;
                }
            }
            return {row: row, column: column, value: value};
        }
    }

//    (* Initial call *)
//    minimax(origin, depth, TRUE)
}
