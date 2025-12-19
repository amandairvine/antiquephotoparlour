export function initializeFaqPage() {
    console.log('Initializing faq page functionality...');

    const questionItems = document.querySelectorAll('.faq-questions .question-item');
    const answerItems = document.querySelectorAll('.faq-answers .question-item');
    const contentArea = document.querySelector('.content-area');
    
    console.log('Found question items:', questionItems.length);
    console.log('Found answer items:', answerItems.length);

    function isDesktop() {
        return window.innerWidth >= 1024;
    }

    // Initialize desktop on load
    function initDesktop() {
        if (isDesktop()) {
            // Hide all answer items
            answerItems.forEach(answer => {
                answer.style.display = 'none';
                answer.classList.remove('active');
            });
            
            // Show first answer item if it exists
            if (answerItems.length > 0) {
                answerItems[0].style.display = 'block';
                answerItems[0].classList.add('active');
            }
        } else {
            // Mobile: reset display
            answerItems.forEach(answer => {
                answer.style.display = '';
            });
        }
    }

    // Run on load
    initDesktop();

    questionItems.forEach((item, index) => {
        const navItem = item.querySelector('.nav-item');

        if (navItem) {
            navItem.addEventListener('click', function () {
                if (isDesktop()) {
                    // DESKTOP: Show corresponding answer on right side
                    answerItems.forEach(answer => {
                        answer.style.display = 'none';
                        answer.classList.remove('active');
                    });
                    
                    if (answerItems[index]) {
                        answerItems[index].style.display = 'block';
                        answerItems[index].classList.add('active');
                    }

                    // Scroll the clicked question to the top of content-area
                    if (contentArea) {
                        const itemRect = item.getBoundingClientRect();
                        const contentRect = contentArea.getBoundingClientRect();
                        const scrollOffset = itemRect.top - contentRect.top;
                        
                        contentArea.scrollTo({
                            top: contentArea.scrollTop + scrollOffset,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // MOBILE: Accordion behavior
                    const wasActive = item.classList.contains('active');
                    
                    // Close all other questions first
                    questionItems.forEach(q => q.classList.remove('active'));
                    
                    // If it wasn't active, open it
                    if (!wasActive) {
                        item.classList.add('active');
                        
                        // Scroll to top after opening
                        setTimeout(() => {
                            item.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 50);
                    }
                }
            });
        }
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Remove all active classes on mobile
            questionItems.forEach(item => item.classList.remove('active'));
            
            // Reinitialize desktop layout
            initDesktop();
        }, 250);
    });
}