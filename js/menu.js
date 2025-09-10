document.addEventListener("DOMContentLoaded", () => {
    const btnMenu = document.querySelector(".menu-hamburguer");
    const cabecalhoHeader = document.querySelector(".cabecalho");

    btnMenu.addEventListener("click", () => {
        cabecalhoHeader.classList.toggle("menu-ativo");
    });
});
