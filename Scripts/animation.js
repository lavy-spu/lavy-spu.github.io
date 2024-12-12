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

// The modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("resumeModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});