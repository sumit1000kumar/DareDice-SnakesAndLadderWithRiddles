// Modal Logic for How to Play
document.addEventListener('DOMContentLoaded', function () {
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    const modal = document.getElementById('howToPlayModal');
    const closeBtn = document.getElementById('closeModal');

    howToPlayBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
