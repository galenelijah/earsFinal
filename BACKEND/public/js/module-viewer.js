// Module viewer script
document.addEventListener('DOMContentLoaded', function() {
    const moduleId = window.MODULE_ID; // Use injected module ID
    let lastScrollPosition = 0;
    let scrollTimeout;

    // Function to calculate reading progress
    function calculateProgress() {
        const contentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = (window.scrollY / contentHeight) * 100;
        return Math.min(Math.round(currentProgress), 100);
    }

    // Function to update progress
    async function updateProgress(progress) {
        try {
            const response = await fetch('/progress/api/module/' + moduleId + '/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    moduleId,
                    percentageComplete: progress,
                    overallStatus: progress >= 90 ? 'completed' : 'in-progress'
                })
            });

            if (!response.ok) {
                console.error('Failed to update progress');
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    // Track scrolling
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        // Update progress after user stops scrolling for 1 second
        scrollTimeout = setTimeout(() => {
            const currentProgress = calculateProgress();
            // Only update if progress has changed significantly (more than 5%)
            if (Math.abs(currentProgress - lastScrollPosition) > 5) {
                lastScrollPosition = currentProgress;
                updateProgress(currentProgress);
            }
        }, 1000);
    });

    // Initial progress check
    const initialProgress = calculateProgress();
    updateProgress(initialProgress);
}); 