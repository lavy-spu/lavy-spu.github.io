document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("typing-text");
    const text = textElement.textContent;
    textElement.textContent = "";
    textElement.classList.add("typing-effect");

    let index = 0;
    function type() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100); // Adjust typing speed here
        } else {
            textElement.classList.remove("typing-effect");
            textElement.classList.add("blinking-cursor");
        }
    }

    type();
});