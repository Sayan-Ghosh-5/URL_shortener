document.addEventListener('DOMContentLoaded', () => {
    const shortenBtn = document.getElementById('shortenBtn');
    const originalUrlInput = document.getElementById('originalUrl');
    const resultContainer = document.getElementById('result');
    const shortUrlSpan = document.getElementById('shortUrl');
    const qrcodeContainer = document.getElementById('qrcode');
    const copyBtn = document.getElementById('copyBtn');

    // --- URL Shortening ---
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

            // Refresh analytics chart after creating a new URL
            loadAnalytics();

        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    });

    // --- Copy to Clipboard ---
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

    // --- Analytics Chart ---
    let analyticsChart = null;

    async function loadAnalytics() {
        const noDataMessage = document.getElementById('noDataMessage');
        const canvas = document.getElementById('analyticsChart');

        try {
            const response = await fetch('/api/analytics');
            if (!response.ok) throw new Error('Failed to fetch analytics');

            const data = await response.json();

            // Filter to only URLs with at least 1 click
            const clickedData = data.filter(item => item.click_count > 0);

            if (clickedData.length === 0) {
                canvas.style.display = 'none';
                noDataMessage.classList.remove('hidden');
                if (analyticsChart) {
                    analyticsChart.destroy();
                    analyticsChart = null;
                }
                return;
            }

            canvas.style.display = 'block';
            noDataMessage.classList.add('hidden');

            const labels = clickedData.map(item => item.short_code);
            const counts = clickedData.map(item => item.click_count);

            // Gradient colors for bars
            const barColors = clickedData.map((_, i) => {
                const hue = 240 + (i * 12); // Indigo to purple gradient range
                return `hsla(${hue}, 80%, 65%, 0.85)`;
            });

            const borderColors = clickedData.map((_, i) => {
                const hue = 240 + (i * 12);
                return `hsla(${hue}, 80%, 55%, 1)`;
            });

            if (analyticsChart) {
                analyticsChart.destroy();
            }

            const ctx = canvas.getContext('2d');

            analyticsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Click Count',
                        data: counts,
                        backgroundColor: barColors,
                        borderColor: borderColors,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#f8fafc',
                            bodyColor: '#94a3b8',
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            padding: 12,
                            callbacks: {
                                title: function(tooltipItems) {
                                    const idx = tooltipItems[0].dataIndex;
                                    return clickedData[idx].short_code;
                                },
                                afterTitle: function(tooltipItems) {
                                    const idx = tooltipItems[0].dataIndex;
                                    const url = clickedData[idx].original_url;
                                    return url.length > 50 ? url.substring(0, 50) + '…' : url;
                                },
                                label: function(context) {
                                    return ` ${context.parsed.y} clicks`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#94a3b8',
                                font: {
                                    family: 'Outfit',
                                    size: 12,
                                    weight: 600
                                }
                            },
                            grid: {
                                display: false
                            },
                            border: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#94a3b8',
                                font: {
                                    family: 'Outfit',
                                    size: 12
                                },
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            border: {
                                display: false
                            }
                        }
                    },
                    animation: {
                        duration: 800,
                        easing: 'easeOutQuart'
                    }
                }
            });

        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    // Load analytics on page load
    loadAnalytics();
});
