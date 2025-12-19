document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll(".collapsible-header");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const collapsible = header.parentElement;
            collapsible === null || collapsible === void 0 ? void 0 : collapsible.classList.toggle("open");
            const content = header.nextElementSibling;
            if (content) {
                if (content.style.maxHeight) {
                    content.style.maxHeight = "";
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });
});