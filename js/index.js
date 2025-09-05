/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
const btnAdicionarCarrinho = document.querySelectorAll(".add-ao-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");

function addItemNoCarrinho(evento) {
    //pegar as informações do produto
    const elementoProduto = evento.target.closest(".produto");
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome-produto").textContent.trim();
    const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
    const produtoPreco = parseFloat(elementoProduto?.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", ".").trim());

    const produto = {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImagem,
        preco: produtoPreco,
        quantidade: 1
    }

    //buscar lista de produtos localstorage
    const carrinho = obterProdutosDoCarrinho("carrinho");
    //testar se o produto já está no carrinho
    produtoExisteNoCarrinho(carrinho, produto);
    salvarProdutosNoCarrinho("carrinho", carrinho)
}

btnAdicionarCarrinho.forEach(btn => {
    btn.addEventListener("click", addItemNoCarrinho);
})

function salvarProdutosNoCarrinho(key, dados) {
    localStorage.setItem(key, JSON.stringify(dados));
}

function obterProdutosDoCarrinho(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function produtoExisteNoCarrinho(carrinho, novoProduto) {
    const itemExiste = carrinho.find(item => item.id === novoProduto.id);
    itemExiste ? itemExiste.quantidade += 1 : carrinho.push(novoProduto);
}