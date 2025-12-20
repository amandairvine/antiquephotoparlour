export function initializeFaqPage() {
    const questionItems = document.querySelectorAll('.faq-questions .question-item');
    const answerItems = document.querySelectorAll('.faq-answers .question-item');
    const contentArea = document.querySelector('.content-area');

    function isDesktop() {
        return window.innerWidth >= 1440;
    }

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
            answerItems.forEach(answer => {
                answer.style.display = '';
            });
        }
    }

    initDesktop();

    questionItems.forEach((item, index) => {
        const navItem = item.querySelector('.nav-item');

        if (navItem) {
            navItem.addEventListener('click', function () {
                if (isDesktop()) {
                    // DESKTOP
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
                    
                    if (!wasActive) {
                        item.classList.add('active');
                        
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

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            questionItems.forEach(item => item.classList.remove('active'));
            
            initDesktop();
        }, 250);
    });
}