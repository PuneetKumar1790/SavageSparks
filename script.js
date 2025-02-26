document.addEventListener("DOMContentLoaded", function () {
    const normalButton = document.getElementById("normalButton");
    const roastButton = document.getElementById("roastButton");
    const inputContainer = document.getElementById("inputContainer");
    const submitButton = document.getElementById("submitButton");
    const userInput = document.getElementById("userInput");
    const resultContainer = document.getElementById("resultContainer");
    const resultContent = document.getElementById("resultContent");

    let mode = "intro"; // Default mode

    // Handle normal introduction
    normalButton.addEventListener("click", function () {
        mode = "intro"; // Set mode to "intro"
        inputContainer.classList.remove("hidden"); // Show input field
    });

    // Handle roast mode
   // Handle roast mode
roastButton.addEventListener("click", function () {
    mode = "roast"; // Set mode to "roast"
    inputContainer.classList.add("hidden"); // Hide input field since roast doesn’t need input

    let name = "random"; // Default value for roasting

    console.log("Sending Request for Roast:", { name, mode }); // Debugging

    fetch("https://savagesparks-production.up.railway.app/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mode }),
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(JSON.stringify(err)) });
        }
        return res.json();
    })
    .then(data => {
        console.log("API Response:", data); // Debugging

        if (data.message) {
            resultContent.textContent = data.message;
            resultContainer.classList.remove("hidden");
            setTimeout(() => speakText(data.message), 500); // Delay speech slightly
        }
    })
    .catch(error => {
        console.error("API Error:", error);
        alert("Error occurred! Check console.");
    });
});


    // Handle form submission
    submitButton.addEventListener("click", function () {
        let name = userInput.value.trim();
        
        // If roast mode is selected, we don't require a name
        if (mode === "roast") {
            name = "random"; // Provide a default value if API needs it
        } else if (name === "") {
            alert("Please enter some text!");
            return;
        }

        console.log("Sending Request:", { name, mode }); // Debugging

        fetch("https://savagesparks-production.up.railway.app/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mode }),
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(JSON.stringify(err)) });
            }
            return res.json();
        })
        .then(data => {
            console.log("API Response:", data); // Debugging

            if (data.message) {
                resultContent.textContent = data.message;
                resultContainer.classList.remove("hidden");
                setTimeout(() => speakText(data.message), 500); // Delay speech slightly
            }
        })
        .catch(error => {
            console.error("API Error:", error);
            alert("Error occurred! Check console.");
        });
    });

    // Text-to-Speech Function
    function speakText(text) {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel(); // Stop any previous speech
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = "hi-IN";
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        } else {
            console.error("Speech Synthesis API is NOT supported in this browser.");
        }
    }
});
