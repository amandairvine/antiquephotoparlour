export function initializeFaqPage() {
    console.log('Initializing faq page functionality...');

    const questionItems = document.querySelectorAll('.question-item')
    const navItems = document.querySelectorAll('.nav-item');
    const faqContents = document.querySelectorAll('.faq-content');

    // Initial setup: Ensure only the first item is active on page load
    // This initial logic remains the same for desktop/first-load experience
    questionItems.forEach(item => item.classList.remove('active'));
    faqContents.forEach(content => content.classList.remove('active'));
    navItems.forEach(nav => nav.classList.remove('active'));

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Find the parent .question-item and the sibling .faq-content
            const currentQuestionItem = this.closest('.question-item');
            const targetContent = currentQuestionItem ? currentQuestionItem.querySelector('.faq-content') : null;

            // Check if the current question is already active
            const isActive = currentQuestionItem ? currentQuestionItem.classList.contains('active') : false;

            if (isActive) {
                // 1. If it's active, deactivate both the parent item, nav item, and content (to close the accordion)
                if (currentQuestionItem) {
                    currentQuestionItem.classList.remove('active');
                }
                this.classList.remove('active');
                if (targetContent) {
                    targetContent.classList.remove('active');
                }
            } else {
                // 2. If it's NOT active, close ALL other items (reset)
                questionItems.forEach(item => item.classList.remove('active'));
                navItems.forEach(nav => nav.classList.remove('active'));
                faqContents.forEach(content => content.classList.remove('active'));

                // 3. Activate the clicked item and its content
                if (currentQuestionItem) {
                    currentQuestionItem.classList.add('active');
                }
                this.classList.add('active');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        });
    });
}