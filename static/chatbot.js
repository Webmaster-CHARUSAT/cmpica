document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully!");
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

function toggleChat() {
    let chatbox = document.getElementById("chatbox");
    chatbox.classList.toggle("hidden");
}

function sendMessage(messageText = null) {
    let userInputField = document.getElementById("user-input");
    let userInput = (typeof messageText === "string" && messageText.trim())
        ? messageText.trim()
        : userInputField.value.trim();

    if (!userInput) return;

    let chatMessages = document.getElementById("chat-messages");

    // Show user message
    let userMsgElement = document.createElement("p");
    userMsgElement.innerHTML = `<strong>You:</strong> ${userInput}`;
    chatMessages.appendChild(userMsgElement);
    userInputField.value = "";
    userInputField.blur(); 

    // Send to Flask backend
    fetch("https://charusat-chatbot.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        const response = data.response;

        if (Array.isArray(response)) {
            response.forEach(item => {
                if (isOption(item)) {
                    const button = document.createElement("button");
                    button.className = "option-button";
                    button.innerText = item;
                    button.onclick = () => sendMessage(item);
                    chatMessages.appendChild(button);
                } else {
                    const botMsg = document.createElement("p");
                    botMsg.innerHTML = `<strong>Bot:</strong> ${item}`;
                    chatMessages.appendChild(botMsg);
                }
            });
        } else {
            const botMsg = document.createElement("p");
            botMsg.innerHTML = `<strong>Bot:</strong> ${response}`;
            chatMessages.appendChild(botMsg);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

function isOption(text) {
    // Define simple rule for option buttons
    const maxWords = 6;
    return typeof text === "string" && text.length <= 40 && text.split(" ").length <= maxWords;
}
