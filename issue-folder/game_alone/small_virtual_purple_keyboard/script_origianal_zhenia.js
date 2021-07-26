const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        this.elements.main = document.querySelector(".keyboard");
        this.elements.keysContainer = document.querySelector(".keyboard__keys");
        this.elements.main.classList.add("keyboard--hidden");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        let textInput = document.querySelector(".use-keyboard-input");

        let toggleKeyboardButton = document.querySelector(".toggle-keyboard");
        toggleKeyboardButton.addEventListener("click", () => {
            const isKeyboardOpen = !this.elements.main.classList.contains("keyboard--hidden");
            isKeyboardOpen
                ? this.close()
                : this.open(
                    textInput.value,
                    currentValue => { textInput.value += currentValue; },
                    () => textInput.value = textInput.value.substring(0, textInput.value.length - 1))
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "ё", "1", '2', "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ",
            // "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
            // "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "я", "ч", "с", "м", "и", "т", "ь", "б","ю", ".",
            // "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "ъ", "enter", "."].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            const specialCharacterIndex = this.specialCharacters.capsOff.indexOf(key);

            if (specialCharacterIndex > 0) {
                const capsOffValue = this.specialCharacters.capsOff[specialCharacterIndex];
                const capsOnValue = this.specialCharacters.capsOn[specialCharacterIndex];

                keyElement.textContent = capsOffValue;
                keyElement.addEventListener("click", () => {
                    this.properties.value = this.properties.capsLock ? capsOnValue : capsOffValue;
                    this._triggerEvent("oninput");
                });
            }
            else if (key === "backspace") {
                keyElement.classList.add("keyboard__key--wide");
                keyElement.innerHTML = createIconHTML("backspace");

                keyElement.addEventListener("click", () => {
                    this._triggerEvent("onbackspace");
                });
            }
            else if (key === "caps") {
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                keyElement.innerHTML = createIconHTML("keyboard_capslock");

                keyElement.addEventListener("click", () => {
                    this._toggleCapsLock();
                    keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                });
            }
            else if (key === "enter") {
                keyElement.classList.add("keyboard__key--wide");
                keyElement.innerHTML = createIconHTML("keyboard_return");

                keyElement.addEventListener("click", () => {
                    this.properties.value = "\n";
                    this._triggerEvent("oninput");
                });
            }
            else if (key === "space") {
                keyElement.classList.add("keyboard__key--extra-wide");
                keyElement.innerHTML = createIconHTML("space_bar");

                keyElement.addEventListener("click", () => {
                    this.properties.value = " ";
                    this._triggerEvent("oninput");
                });
            }
            else if (key === "done") {
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                keyElement.innerHTML = createIconHTML("check_circle");

                keyElement.addEventListener("click", () => {
                    this.close();
                    this._triggerEvent("onclose");
                });
            }
            else {
                keyElement.textContent = key.toLowerCase();
                keyElement.addEventListener("click", () => {
                    this.properties.value = this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                    this._triggerEvent("oninput");
                });
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    specialCharacters: {
        capsOff: '1234567890-=.',
        capsOn: '!"№;%:?*()_+,'
    },

    _isSpecialCharacter(character) {
        const allSpecialCharacters = this.specialCharacters.capsOff.concat(this.specialCharacters.capsOn)
        return allSpecialCharacters.indexOf(character) !== -1;
    },

    _isLetter(character) {
        let match = character.match(/[ЁёА-я]/g);
        return character.length === 1 && !!match;
    },

    _toggleKey(key, capsOn) {
        const isSpecialCharacter= this._isSpecialCharacter(key.textContent);
        const isLetter = this._isLetter(key.textContent);

        if (!(isSpecialCharacter || isLetter))
            return;

        if (isLetter && capsOn) {
            key.textContent = key.textContent.toUpperCase();
        }
        else if (isLetter && !capsOn) {
            key.textContent = key.textContent.toLowerCase();
        }
        else if (!isLetter && capsOn) {
            const index = this.specialCharacters['capsOff'].indexOf(key.textContent);
            key.textContent = this.specialCharacters['capsOn'][index];
        }
        else if (!isLetter && !capsOn) {
            const index = this.specialCharacters['capsOn'].indexOf(key.textContent);
            key.textContent = this.specialCharacters['capsOff'][index];
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        const capsOn = this.properties.capsLock;

        for (const key of this.elements.keys) {
            this._toggleKey(key, capsOn);
        }
    },

    open(initialValue, oninput, onbackspace, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onbackspace = onbackspace;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});

// drag the keyboard
var container = document.querySelector(".keyboard");
var dragItem = document.querySelector(".keyboard__keys");

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === dragItem) {
        active = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
}

function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
        } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}