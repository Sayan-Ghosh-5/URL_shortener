document.addEventListener('DOMContentLoaded', () => {
    const shortenBtn = document.getElementById('shortenBtn');
    const originalUrlInput = document.getElementById('originalUrl');
    const resultContainer = document.getElementById('result');
    const shortUrlSpan = document.getElementById('shortUrl');
    const qrcodeContainer = document.getElementById('qrcode');
    const copyBtn = document.getElementById('copyBtn');

    shortenBtn.addEventListener('click', async () => {
        const originalUrl = originalUrlInput.value.trim();
        if (!originalUrl) {
            alert('Please enter a valid URL');
            return;
        }

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalUrl })
            });

            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }

            const data = await response.json();
            const shortUrl = `${window.location.origin}/${data.shortCode}`;

            // Update UI
            shortUrlSpan.textContent = shortUrl;
            resultContainer.classList.remove('hidden');

            // Generate QR Code
            qrcodeContainer.innerHTML = ''; // Clear previous
            new QRCode(qrcodeContainer, {
                text: shortUrl,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = shortUrlSpan.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        });
    });
});
