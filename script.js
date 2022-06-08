const elements = ["vocals", "drums", "bass", "guitar", "keys"];
const buttons = elements.map((element => `${element}-btn`));
const buttonVideoMap = elements.reduce((map, element) => {
    map[`${element}-btn`] = element;
    return map;
}, {});

const getOthers = (element) => {
    return elements.filter((e) => e !== element);
}

const toggle = (event) => {
    element = buttonVideoMap[event.target.id];
    document.getElementById(element).classList.add("primary");
    getOthers(element).forEach((other) => document.getElementById(other).classList.remove("primary"));
}

const buttonInit = () => {
    buttons.forEach((button) => {
        document.getElementById(button).addEventListener("click", toggle);
    });
}

document.addEventListener("DOMContentLoaded", buttonInit);
