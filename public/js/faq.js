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
    navItems.forEach(nav => {
        nav.classList.remove('active');
        nav.classList.remove('selected');
    });
    answerItems.forEach(answer => answer.classList.remove('show'));

    // Hide all answers initially for desktop
    if (isDesktop()) {
        answerItems.forEach(answer => {
            answer.style.display = 'none';
        });
    }

    answerItems.forEach(item => {
        item.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                return;
            }

            if (isDesktop()) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });

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
                document.querySelectorAll('.faq-questions .nav-item').forEach(nav => {
                    nav.classList.remove('active');
                    nav.classList.remove('selected');
                });

                // Find and show the matching answer
                const matchingAnswer = document.querySelector(`.faq-answers .nav-item[data-faq="${faqId}"]`)?.closest('.question-item');
                if (matchingAnswer) {
                    matchingAnswer.style.display = 'block';
                    matchingAnswer.classList.add('show');
                    matchingAnswer.classList.add('active');
                }

                this.classList.add('selected');

            } else {
                // MOBILE/TABLET BEHAVIOR (below 1024px)
                const isActive = currentQuestionItem ? currentQuestionItem.classList.contains('active') : false;

                if (isActive) {
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

                        this.classList.add('active');
                        if (targetContent) {
                            targetContent.classList.add('active');
                        }

                        setTimeout(() => {
                            currentQuestionItem.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 50);
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
            navItems.forEach(nav => {
                nav.classList.remove('active');
                nav.classList.remove('selected');
            });
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