class TicTacToe {
    static #CURSOR_DISABLED = 'not-allowed';
    static #CURSOR_ENABLED = 'pointer';
    static #DISPLAY_NONE = 'none';
    static #ELEMENT_CELL = 'td';
    static #ELEMENT_ROW = 'tr';
    static #ELEMENT_TABLE = 'table';
    static #PARAMETER_DIFFICULTY = 'difficulty';
    static #PARAMETER_MODE = 'mode';
    static #SELECTOR_BODY = 'body';
    static #SELECTOR_DIFFICULTY = 'select#difficulty';
    static #SELECTOR_FORM = 'form';
    static #SELECTOR_MODE = 'select#mode';
    static #SIZE = 3;

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
        const table = document.createElement(TicTacToe.#ELEMENT_TABLE);
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            const row = document.createElement(TicTacToe.#ELEMENT_ROW);
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                const cell = document.createElement(TicTacToe.#ELEMENT_CELL);
                cell.appendChild(document.createTextNode('*'));
                cell.style.cursor = TicTacToe.#CURSOR_ENABLED;
                cell.onclick = () => {
                    cell.onclick = null;
                    cell.style.cursor = TicTacToe.#CURSOR_DISABLED;
                    cell.removeChild(cell.firstChild);
                    cell.appendChild(document.createTextNode('X'));
                };
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        document.querySelector(TicTacToe.#SELECTOR_BODY).appendChild(table);
    }
}
