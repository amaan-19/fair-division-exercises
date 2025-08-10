function copyCitation(element) {
    const citation = element.getAttribute('data-citation');

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(citation).then(() => {
            showCopyFeedback(element);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback(element);
        } catch (err) {
            console.error('Failed to copy citation');
        }
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'Citation copied!';
    element.style.color = '#38a169';

    setTimeout(() => {
        element.textContent = originalText;
        element.style.color = '#718096';
    }, 2000);
}