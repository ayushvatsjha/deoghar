// Registration Modal
const registerBtn = document.getElementById('registerBtn');
const modal = document.getElementById('registrationModal');
const closeBtn = document.querySelector('.close-modal');

registerBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
