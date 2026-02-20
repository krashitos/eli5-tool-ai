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
        setTimeout(() => toast.classList.add('hidden'), 3000);
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
            const response = await fetch('http://localhost:8000/rewrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Something went wrong');
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
