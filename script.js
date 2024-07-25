document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const scrollToLastBtn = document.getElementById("scrollToLastBtn");

    fetch('chat.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            let previousDate = '';
            let currentMessage = '';
            let currentSender = '';
            let currentTime = '';

            lines.forEach(line => {
                const datePattern = /^\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}\s?[ap]m/;
                if (datePattern.test(line)) {
                    if (currentMessage) {
                        appendMessage(currentMessage, currentSender, currentTime);
                    }

                    const [dateTime, message] = line.split(' - ');
                    const [date, time] = dateTime.split(', ');
                    const [sender, text] = message.split(': ');

                    if (previousDate !== date) {
                        const dayDivider = document.createElement('div');
                        dayDivider.classList.add('day-divider');
                        dayDivider.textContent = date;
                        chatBox.appendChild(dayDivider);
                        previousDate = date;
                    }

                    currentMessage = text.trim();
                    currentSender = sender.trim();
                    currentTime = time.trim();
                } else {
                    currentMessage += '\n' + line.trim();
                }
            });

            if (currentMessage) {
                appendMessage(currentMessage, currentSender, currentTime);
            }

            scrollToLastBtn.style.display = 'block';
        });

    function appendMessage(text, sender, time) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender.toLowerCase());

        const textElement = document.createElement('div');
        textElement.classList.add('text');

        if (text.includes('(file attached)')) {
            const fileName = text.split(' ')[0];
            const fileExtension = fileName.split('.').pop();

            if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'gif') {
                const imgElement = document.createElement('img');
                imgElement.src = `assets/${fileName}`;
                imgElement.alt = fileName;
                imgElement.classList.add('img-fluid');
                textElement.appendChild(imgElement);
            } else if (fileExtension === 'mp4' || fileExtension === 'webm') {
                const videoElement = document.createElement('video');
                videoElement.src = `assets/${fileName}`;
                videoElement.controls = true;
                videoElement.classList.add('img-fluid');
                textElement.appendChild(videoElement);
            } else {
                textElement.textContent = text;
            }
        } else {
            textElement.textContent = text;
        }

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.textContent = `${time} • ${sender}`;

        messageElement.appendChild(textElement);
        messageElement.appendChild(timeElement);
        chatBox.appendChild(messageElement);
    }

    scrollToLastBtn.addEventListener('click', function () {
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
