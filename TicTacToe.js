class TicTacToe {
    static #ELEMENT_CELL = 'td';
    static #ELEMENT_ROW = 'tr';
    static #ELEMENT_TABLE = 'table';
    static #SELECTOR_BODY = 'body';
    static #SIZE = 3;

    static main() {
        new TicTacToe();
    }

    constructor() {
        const table = document.createElement(TicTacToe.#ELEMENT_TABLE);
        for (let i = 0; i < TicTacToe.#SIZE; i++) {
            const row = document.createElement(TicTacToe.#ELEMENT_ROW);
            for (let j = 0; j < TicTacToe.#SIZE; j++) {
                const cell = document.createElement(TicTacToe.#ELEMENT_CELL);
                cell.appendChild(document.createTextNode('*'));
                cell.onclick = () => {
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
