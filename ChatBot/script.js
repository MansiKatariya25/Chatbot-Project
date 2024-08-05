const API_KEY = 'f4bd90583b56bd7dda69d8eff92733ce7da169408874d051201a56a7a6c6c2ae';
const API_URL = 'https://api.together.xyz/v1/chat/completions';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessageToChat('user', message);
        userInput.value = '';
        
        const response = await getLLaMaResponse(message);
        addMessageToChat('bot', response);
    }
}

function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getLLaMaResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
                messages: [
                    { role: "user", content: userMessage }
                ],
                max_tokens: 512,
                temperature: 0.7,
                top_p: 0.7,
                top_k: 50,
                repetition_penalty: 1,
                stop: ["<|eot_id|>"]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return "I'm sorry, I couldn't process your request. Please try again later.";
    }
}

function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    if (sender === 'bot') {
        // Process the bot's message for better formatting
        const formattedMessage = formatBotMessage(message);
        messageElement.innerHTML = formattedMessage;
    } else {
        messageElement.textContent = message;
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatBotMessage(message) {
    // Split the message into paragraphs
    const paragraphs = message.split('\n\n');
    
    // Process each paragraph
    const formattedParagraphs = paragraphs.map(paragraph => {
        // Replace single newlines with <br> tags
        paragraph = paragraph.replace(/\n/g, '<br>');
        
        // Add spacing for list items
        paragraph = paragraph.replace(/^(-|\d+\.)\s/gm, '&nbsp;&nbsp;$1 ');
        
        return `<p>${paragraph}</p>`;
    });
    
    return formattedParagraphs.join('');
}