document.addEventListener("DOMContentLoaded", function () {
    let chatbotIcon = document.getElementById("chatbot-icon");
    let chatbox = document.getElementById("chatbox");
    let sendButton = document.getElementById("send-button");
    let userInput = document.getElementById("user-input");

    // Ensure chatbot starts hidden
    chatbox.style.display = "none";

    // Toggle chat visibility
    chatbotIcon.addEventListener("click", function () {
        if (chatbox.style.display === "none") {
            chatbox.style.display = "block";  // Show the chatbox
        } else {
            chatbox.style.display = "none";  // Hide the chatbox
        }
    });

    // Send message function
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    function sendQuickReply(message) {
        console.log("Quick reply clicked:", message);
        document.getElementById("user-input").value = message;
        sendMessage();
    }
    
    function sendMessage() {
        let userInput = document.getElementById("user-input").value;
        if (!userInput.trim()) return;
    
        let chatContent = document.getElementById("chat-messages");
        chatContent.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById("user-input").value = "";
    
        fetch("https://charusat-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            const messages = Array.isArray(data.response) ? data.response : [data.response];
            let responseHtml = `<p><strong>CMPICA Assistant:</strong> ${messages[0]}</p>`;
    
            if (messages.length > 1) {
                responseHtml += `<div class="chat-options">`;
                for (let i = 1; i < messages.length; i++) {
                    responseHtml += `<button class="option-button" onclick="sendQuickReply('${messages[i]}')">${messages[i]}</button>`;
                }
                
                responseHtml += `</div>`;
            }
    
            chatContent.innerHTML += responseHtml;
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }

    window.sendQuickReply = function (message) {
        console.log("Quick reply clicked:", message);
        document.getElementById("user-input").value = message;
        sendMessage();
    };
    
    
    
});
