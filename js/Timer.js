class Timer {
    static #FORMAT = (min, s) => `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    static #SELECTOR = 'span:nth-of-type(2)';
    static #MS_PER_S = 1000;
    static #S_PER_MIN = 60;

    #start;
    #element;
    #interval;

    constructor() {
        this.#start = new Date();
        this.#element = document.querySelector(Timer.#SELECTOR);
        this.#interval = setInterval(this.#update.bind(this), Timer.#MS_PER_S);
        this.#update();
    }

    stop() {
        clearInterval(this.#interval);
    }

    #update() {
        this.#element.firstChild && this.#element.removeChild(this.#element.firstChild);
        const seconds = Math.floor((new Date() - this.#start) / Timer.#MS_PER_S);
        this.#element.appendChild(document.createTextNode(Timer.#FORMAT(
                Math.floor(seconds / Timer.#S_PER_MIN), seconds % Timer.#S_PER_MIN)));
    }
}