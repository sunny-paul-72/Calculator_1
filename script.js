// Select elements
const display = document.getElementById("display");
const buttonsContainer = document.querySelector(".buttons");

// Prevent invalid characters in the input
display.addEventListener("input", () => {
    // Remove invalid characters
    display.value = display.value.replace(/[^0-9+\-*/.%]/g, "");
    adjustFontSize(); // Adjust font size dynamically
});

// Function to adjust font size based on input length
function adjustFontSize() {
    const maxFontSize = 32; // Maximum font size (in px)
    const minFontSize = 16; // Minimum font size (in px)
    const maxLength = 15; // Maximum characters before resizing

    // Calculate new font size
    const fontSize = Math.max(minFontSize, maxFontSize - Math.max(0, display.value.length - maxLength));
    display.style.fontSize = fontSize + "px";
}

// Append value to the display at the cursor position
function append(value) {
    const { selectionStart, selectionEnd } = display;

    // Insert value at the current cursor position
    display.value =
        display.value.substring(0, selectionStart) +
        value +
        display.value.substring(selectionEnd);

    display.setSelectionRange(selectionStart + value.length, selectionStart + value.length);
    adjustFontSize(); // Adjust font size after appending
}

// Clear the display
function clearDisplay() {
    display.value = "";
    adjustFontSize(); // Reset font size
}

// Delete the last character before the cursor
function deleteLast() {
    const { selectionStart, selectionEnd } = display;

    if (selectionStart === selectionEnd) {
        // Delete one character before the cursor
        display.value =
            display.value.substring(0, selectionStart - 1) +
            display.value.substring(selectionEnd);
        display.setSelectionRange(selectionStart - 1, selectionStart - 1);
    } else {
        // If text is selected, delete the selection
        display.value =
            display.value.substring(0, selectionStart) +
            display.value.substring(selectionEnd);
        display.setSelectionRange(selectionStart, selectionStart);
    }
    adjustFontSize(); // Adjust font size after deletion
}

// Calculate the expression
function calculate() {
    try {
        display.value = eval(display.value) || "";
    } catch {
        display.value = "Error";
    }
    adjustFontSize(); // Adjust font size after calculation
}

// Handle button clicks and key presses
function handleInput(input) {
    if (!isNaN(input) || "+-*/.%".includes(input)) {
        append(input);
    } else if (input === "Enter") {
        calculate();
    } else if (input === "Backspace") {
        deleteLast();
    } else if (input === "Escape") {
        clearDisplay();
    }
}

// Add event listener for buttons
buttonsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) {
        const value = button.dataset.key || button.textContent.trim();
        handleInput(value === "=" ? "Enter" : value);
    }
});

// Add keyboard support with button highlight
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const button = document.querySelector(`[data-key="${key}"]`);

    if (button) {
        button.classList.add("button-active");
        setTimeout(() => button.classList.remove("button-active"), 100);
    }

    handleInput(key);
});
