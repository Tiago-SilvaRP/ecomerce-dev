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
    const produtoTamanho = tamanhoProduto(elementoProduto);
    const produtoPreco = parseFloat(elementoProduto?.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", ".").trim());
    const produtoCor = corProduto(elementoProduto);

    const produto = {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImagem,
        cor: produtoCor,
        tamanho: produtoTamanho,
        preco: produtoPreco,
        quantidade: 1
    }

    //buscar lista de produtos localstorage
    const carrinho = obterProdutosDoCarrinho("carrinho");
    //testar se o produto já está no carrinho
    produtoExisteNoCarrinho(carrinho, produto);
    salvarProdutosNoCarrinho("carrinho", carrinho);
    atualizarContadorDoCarrinho();
    renderizerTabelaCarrinho()
}

function tamanhoProduto(tamanhoDoProduto) {
    const tamanhoElemento = tamanhoDoProduto.querySelector(".tamanho");
    return tamanhoElemento ? tamanhoElemento.textContent
        .toLowerCase().replace("tamanho:", "").trim().toUpperCase() : undefined;
}

function corProduto(corDoProduto) {
    const corElemento = corDoProduto.querySelector(".cor");
    return corElemento ? corElemento.textContent
        .toLowerCase().replace("cor:", "").trim() : undefined;
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

function atualizarContadorDoCarrinho() {
    const carrinho = obterProdutosDoCarrinho("carrinho");
    let total = 0;
    carrinho.forEach(item => total += item.quantidade);

    document.getElementById("contador-carrinho").textContent = total;
}

atualizarContadorDoCarrinho();

function renderizerTabelaCarrinho() {
    const produtosCarrinho = obterProdutosDoCarrinho("carrinho");
    const corpoTabela = document.getElementById("tbody");
    corpoTabela.innerHTML = "";

    produtosCarrinho.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto">
                    <img 
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                    />
                </td>
                <td>${produto.nome}</td>
                <td class="td-preco-unitario">
                    R$ ${produto.preco.toFixed(2).replace(".", ",")}
                </td>
                <td class="td-quantidade">
                    <input type="number" value="${produto.quantidade}" min="1">
                </td>
                <td class="td-preco-total">
                    R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                <td>
                    <button class="btn-remover"
                        data-id="${produto.id}" id="deletar">
                    </button>
                </td>`

        corpoTabela.append(tr);
        console.log(tr);
    });


}
renderizerTabelaCarrinho()