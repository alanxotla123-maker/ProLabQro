document.addEventListener("DOMContentLoaded", function () {
    const chatbotHTML = `
        <div class="chatbot-container">
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="images/imagenChat.png?v=2" alt="Bot Icon" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; background: white; padding: 2px;">
                        <span>ProLab Assistant</span>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">&times;</button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chat-message bot">
                        ¡Hola! Soy el asistente virtual de PRO-LAB QRO. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Escribe tu mensaje..." autocomplete="off">
                    <button id="chatbotSend">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="chatbot-button" id="chatbotToggle">
                <img src="images/imagenChat.png?v=2" alt="Chatbot">
            </button>
        </div>
    `;
    

    // Inject chatbot HTML into body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    function toggleChatbot() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    }

    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);

    function addMessage(message, sender, isHTML = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        if (isHTML) {
            messageDiv.innerHTML = message;
        } else {
            messageDiv.textContent = message;
        }
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTyping() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    function addOptions(options) {
        // Remover opciones anteriores si existen
        const existingOptions = document.querySelector('.chatbot-options');
        if (existingOptions) {
            existingOptions.remove();
        }

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chatbot-options';

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'chatbot-option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => {
                chatbotInput.value = option;
                handleSend();
            });
            optionsDiv.appendChild(btn);
        });

        chatbotMessages.appendChild(optionsDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Mostrar opciones iniciales
    setTimeout(() => {
        addOptions(["Cotizar", "Productos", "Promociones", "WhatsApp", "Horario"]);
    }, 500);

    function handleSend() {
        const text = chatbotInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatbotInput.value = '';

            // Remover opciones al enviar el mensaje
            const existingOptions = document.querySelector('.chatbot-options');
            if (existingOptions) {
                existingOptions.remove();
            }

            // Mostrar "escribiendo..."
            showTyping();

            // Simulate bot response
            setTimeout(() => {
                removeTyping(); // Quitar animación

                const lowerText = text.toLowerCase();
                let botResponse = "Gracias por tu mensaje. Un asesor se comunicará contigo pronto. Si deseas, puedes enviarnos un correo a <a href='mailto:atencionaclientes@prolabqro.com'>atencionaclientes@prolabqro.com</a>.";
                let isHTML = true;
                let nextOptions = ["Cotizar", "Productos", "Promociones", "WhatsApp", "Horario"];

                if (lowerText.includes("precio") || lowerText.includes("cotización") || lowerText.includes("cotizar")) {
                    botResponse = "Para cotizaciones, por favor envíanos un correo a <a href='mailto:atencionaclientes@prolabqro.com'>atencionaclientes@prolabqro.com</a> o ve a nuestra <a href='#contacto'>sección de contacto</a>.";
                } else if (lowerText.includes("horario")) {
                    botResponse = "Nuestro horario de atención es de Lunes a Viernes de 09:00 a 18:00 hrs.";
                    isHTML = false;
                } else if (lowerText.includes("ubicación") || lowerText.includes("dónde están") || lowerText.includes("donde")) {
                    botResponse = "Estamos ubicados en Calle de las Nubes 119, Col. Josefa Ortiz de Dominguez, Qro. <br><br><a href='https://goo.gl/maps/x' target='_blank'>Abrir en Google Maps</a>";
                } else if (lowerText.includes("hola") || lowerText.includes("buenos días") || lowerText.includes("buenas tardes")) {
                    botResponse = "¡Hola! Soy el asistente virtual de PRO-LAB QRO. ¿En qué puedo ayudarte hoy?";
                    isHTML = false;
                } else if (lowerText.includes("producto") || lowerText.includes("catálogo")) {
                    botResponse = "Manejamos material y equipo para diferentes sectores. ¿De qué área buscas?";
                    nextOptions = ["Laboratorios", "Hospitales", "Industria", "Escuelas", "Volver al inicio"];
                    isHTML = false;
                } else if (lowerText.includes("laboratorio") || lowerText.includes("hospital") || lowerText.includes("industria") || lowerText.includes("escuela")) {
                    if (lowerText.includes("hospital")) {
                        botResponse = "Excelente. Puedes consultar las marcas que manejamos para hospitales haciendo <a href='hospitales.html'>clic aquí</a>.";
                    } else {
                        botResponse = "Excelente. Puedes consultar nuestro catálogo de marcas generales haciendo <a href='marcas.html'>clic aquí</a>.";
                    }
                } else if (lowerText.includes("whatsapp") || lowerText.includes("asesor") || lowerText.includes("humano")) {
                    botResponse = "¡Claro! Haz <a href='https://wa.me/524422106250?text=Hola,%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n' target='_blank'>clic aquí para platicar con un asesor por WhatsApp</a>.";
                } else if (lowerText.includes("promocion") || lowerText.includes("promoción") || lowerText.includes("mes") || lowerText.includes("promociones")) {
                    botResponse = "Tenemos grandes promociones este mes. Puedes ver nuestro folleto en PDF haciendo <a href='pdf/promosoct_nov2020.pdf' target='_blank'>clic aquí</a>.";
                } else if (lowerText.includes("volver") || lowerText.includes("inicio")) {
                    botResponse = "¿En qué más te puedo ayudar?";
                    isHTML = false;
                }

                addMessage(botResponse, 'bot', isHTML);

                // Mostrar opciones de nuevo después de responder
                setTimeout(() => {
                    addOptions(nextOptions);
                }, 600);
            }, 1200);
        }
    }

    chatbotSend.addEventListener('click', handleSend);
    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
