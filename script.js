document.addEventListener("DOMContentLoaded", () => {
  const normalButton = document.getElementById("normalButton");
  const roastButton = document.getElementById("roastButton");
  const inputContainer = document.getElementById("inputContainer");
  const userInput = document.getElementById("userInput");
  const charCounter = document.querySelector(".char-counter");
  const submitButton = document.getElementById("submitButton");
  const resultContainer = document.getElementById("resultContainer");
  const resultTitle = document.getElementById("resultTitle");
  const resultContent = document.getElementById("resultContent");

  let isRoastMode = false;

  // Show input box when "Normal" or "Roast" button is clicked
  normalButton.addEventListener("click", () => showInputContainer(false));
  roastButton.addEventListener("click", () => showInputContainer(true));

  function showInputContainer(roastMode) {
      isRoastMode = roastMode;
      inputContainer.classList.remove("hidden");
      userInput.placeholder = roastMode ? "Tell us about yourself... if you dare 🔥" : "Introduce yourself...";
      userInput.value = ""; // Clear input
      updateCharCounter();
      document.querySelector(".choice-container").classList.add("hidden");
  }

  // Character counter
  userInput.addEventListener("input", updateCharCounter);

  function updateCharCounter() {
      const remaining = 500 - userInput.value.length;
      charCounter.textContent = `${remaining} characters remaining`;
  }

  // Function to send request
  function sendRequest(mode) {
      let name = userInput.value.trim();

      if (!name) {
          alert("Please enter some details about yourself first!");
          return;
      }

      // Disable button & show loading
      submitButton.disabled = true;
      submitButton.innerHTML = "Generating...";

      fetch("https://savagesparks-production.up.railway.app/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, mode }),
      })
      .then(res => res.json())
      .then(data => {
          resultContent.textContent = data.message;  // Set the response from API
          resultTitle.textContent = mode === "roast" ? "Your Savage Roast" : "Welcome!";
          resultContainer.classList.remove("hidden");
          inputContainer.classList.add("hidden");
      })
      .catch(error => {
          console.error(error);
          alert("Something went wrong!");
      })
      .finally(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = '<span class="button-text">SUBMIT</span>';
      });
  }

  // Submit button click handlers
  submitButton.addEventListener("click", () => sendRequest(isRoastMode ? "roast" : "intro"));
});



