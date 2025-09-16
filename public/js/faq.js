export function initializeFaqPage() {
    console.log('Initializing faq page functionality...');

    const navItems = document.querySelectorAll('.nav-item');
    const faqContents = document.querySelectorAll('.faq-content');

    const initialFaq = document.querySelector('.faq-content.active');
    if (initialFaq) {
        const initialFaqName = initialFaq.id;
        const initialNavItem = document.querySelector(`.nav-item[data-faq="${initialFaqName}"]`);
        if (initialNavItem) {
            navItems.forEach(nav => nav.classList.remove('active'));
            initialNavItem.classList.add('active');
        }
    } else {
        if (navItems.length > 0) {
            navItems[0].classList.add('active');
            const firstFaqContent = document.getElementById(navItems[0].getAttribute('data-faq'));
            if (firstFaqContent) {
                firstFaqContent.classList.add('active');
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const faqName = this.getAttribute('data-faq');

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            faqContents.forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(faqName);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}