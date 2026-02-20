document.addEventListener('DOMContentLoaded', () => {
    const rewriteBtn = document.getElementById('rewrite-btn');
    const complexText = document.getElementById('complex-text');
    const outputSection = document.getElementById('output-section');
    const simplifiedText = document.getElementById('simplified-text');
    const durationTag = document.getElementById('duration-tag');
    const spinner = rewriteBtn.querySelector('.spinner');
    const btnText = rewriteBtn.querySelector('.btn-text');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 5000);
    };

    const handleRewrite = async () => {
        const text = complexText.value.trim();

        if (!text) {
            showToast('Please paste some text first!');
            return;
        }

        // Loading state
        rewriteBtn.disabled = true;
        spinner.classList.remove('hidden');
        btnText.textContent = 'Simplifying...';
        outputSection.classList.add('hidden');

        try {
            const response = await fetch('/rewrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                let errorMessage = 'Something went wrong';
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;
                } else {
                    const textError = await response.text();
                    errorMessage = textError.slice(0, 50) + "...";
                }
                throw new Error(errorMessage);
            }

            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response");
            }

            const data = await response.json();

            // Success state
            simplifiedText.textContent = data.simplified;
            durationTag.textContent = `Generated in ${data.duration.toFixed(1)}s`;
            outputSection.classList.remove('hidden');

            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error:', error);
            showToast(`Error: ${error.message}`);
        } finally {
            // Restore button
            rewriteBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Rewrite for a Child';
        }
    };

    rewriteBtn.addEventListener('click', handleRewrite);

    copyBtn.addEventListener('click', () => {
        const text = simplifiedText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard! ✅');
        });
    });

    // Handle Ctrl+Enter for quick submission
    complexText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleRewrite();
        }
    });
});
