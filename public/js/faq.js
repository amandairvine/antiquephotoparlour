// export function initializeFaqPage() {
//     console.log('Initializing faq page functionality...');

//     const questionItems = document.querySelectorAll('.question-item')
//     const navItems = document.querySelectorAll('.nav-item');
//     const faqContents = document.querySelectorAll('.faq-content');

//     // Initial setup: Ensure only the first item is active on page load
//     // This initial logic remains the same for desktop/first-load experience
//     questionItems.forEach(item => item.classList.remove('active'));
//     faqContents.forEach(content => content.classList.remove('active'));
//     navItems.forEach(nav => nav.classList.remove('active'));

//     navItems.forEach(item => {
//         item.addEventListener('click', function () {
//             // Find the parent .question-item and the sibling .faq-content
//             const currentQuestionItem = this.closest('.question-item');
//             const targetContent = currentQuestionItem ? currentQuestionItem.querySelector('.faq-content') : null;

//             // Check if the current question is already active
//             const isActive = currentQuestionItem ? currentQuestionItem.classList.contains('active') : false;

//             if (isActive) {
//                 // 1. If it's active, deactivate both the parent item, nav item, and content (to close the accordion)
//                 if (currentQuestionItem) {
//                     currentQuestionItem.classList.remove('active');
//                 }
//                 this.classList.remove('active');
//                 if (targetContent) {
//                     targetContent.classList.remove('active');
//                 }
//             } else {
//                 // 2. If it's NOT active, close ALL other items (reset)
//                 questionItems.forEach(item => item.classList.remove('active'));
//                 navItems.forEach(nav => nav.classList.remove('active'));
//                 faqContents.forEach(content => content.classList.remove('active'));

//                 // 3. Activate the clicked item and its content
//                 if (currentQuestionItem) {
//                     currentQuestionItem.classList.add('active');
//                 }
//                 this.classList.add('active');
//                 if (targetContent) {
//                     targetContent.classList.add('active');
//                 }
//             }
//         });
//     });
// }

// FAQ Question-Answer Toggle Script
export function initializeFaqPage() {
    console.log('Initializing faq page functionality...');

    const questionItems = document.querySelectorAll('.faq-questions .question-item');
    const navItems = document.querySelectorAll('.faq-questions .nav-item');
    const faqContents = document.querySelectorAll('.faq-questions .faq-content');
    const answerItems = document.querySelectorAll('.faq-answers .question-item');

    function isDesktop() {
        return window.innerWidth >= 1024;
    }

    // Initial setup
    questionItems.forEach(item => item.classList.remove('active'));
    faqContents.forEach(content => content.classList.remove('active'));
    navItems.forEach(nav => nav.classList.remove('active'));
    answerItems.forEach(answer => answer.classList.remove('show'));

    // Hide all answers initially for desktop
    if (isDesktop()) {
        answerItems.forEach(answer => {
            answer.style.display = 'none';
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const currentQuestionItem = this.closest('.question-item');
            const targetContent = currentQuestionItem ? currentQuestionItem.querySelector('.faq-content') : null;
            const faqId = this.getAttribute('data-faq');

            if (isDesktop()) {
                // DESKTOP BEHAVIOR (1024px and up)
                // Don't show active state on question side
                // Show the answer on the right side instead

                // Hide all answers
                answerItems.forEach(answer => {
                    answer.style.display = 'none';
                    answer.classList.remove('show');
                });

                // Remove active from all answer items
                document.querySelectorAll('.faq-answers .question-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Find and show the matching answer
                const matchingAnswer = document.querySelector(`.faq-answers .nav-item[data-faq="${faqId}"]`)?.closest('.question-item');
                if (matchingAnswer) {
                    matchingAnswer.style.display = 'block';
                    matchingAnswer.classList.add('show');
                    matchingAnswer.classList.add('active');
                }
            } else {
                // MOBILE/TABLET BEHAVIOR (below 1024px)
                // Original accordion behavior
                const isActive = currentQuestionItem ? currentQuestionItem.classList.contains('active') : false;

                if (isActive) {
                    // Close the accordion
                    if (currentQuestionItem) {
                        currentQuestionItem.classList.remove('active');
                    }
                    this.classList.remove('active');
                    if (targetContent) {
                        targetContent.classList.remove('active');
                    }
                } else {
                    // Open the accordion
                    questionItems.forEach(item => item.classList.remove('active'));
                    navItems.forEach(nav => nav.classList.remove('active'));
                    faqContents.forEach(content => content.classList.remove('active'));

                    if (currentQuestionItem) {
                        currentQuestionItem.classList.add('active');
                    }
                    this.classList.add('active');
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                }
            }
        });
    });

    // Show first answer by default on desktop
    if (isDesktop() && navItems.length > 0) {
        navItems[0].click();
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Reset everything on resize
            questionItems.forEach(item => item.classList.remove('active'));
            faqContents.forEach(content => content.classList.remove('active'));
            navItems.forEach(nav => nav.classList.remove('active'));
            answerItems.forEach(answer => {
                answer.classList.remove('show');
                answer.classList.remove('active');
            });

            if (isDesktop()) {
                // Hide all answers and show first one
                answerItems.forEach(answer => {
                    answer.style.display = 'none';
                });
                if (navItems.length > 0) {
                    navItems[0].click();
                }
            } else {
                // Reset display for mobile
                answerItems.forEach(answer => {
                    answer.style.display = '';
                });
            }
        }, 250);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFaqPage);