document.addEventListener("DOMContentLoaded", () => {
    const meowEng = document.getElementById('meow-eng');
    if (meowEng !== null) meowEng.textContent = meowEng.textContent + (' Meow'.repeat(1000));

    const meowRu = document.getElementById('meow-ru');
    if (meowRu !== null) meowRu.textContent = meowRu.textContent + (' Мяу'.repeat(1000));

    window.addEventListener('scroll', function() {
        if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 100) {
            if (meowEng !== null) meowEng.textContent = meowEng.textContent + (' Meow'.repeat(1000));
            if (meowRu !== null) meowRu.textContent = meowRu.textContent + (' Мяу'.repeat(1000));
        }
    });
});