const btnAdicionarCarrinho = document.querySelectorAll(".add-ao-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");

btnAdicionarCarrinho.forEach(btn => {
    btn.addEventListener("click", addItemNoCarrinho);
});

function addItemNoCarrinho(evento) {
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
    };

    const carrinho = obterProdutosDoCarrinho("carrinho");
    produtoExisteNoCarrinho(carrinho, produto);
    salvarProdutosNoCarrinho("carrinho", carrinho);
    atualizarCarrinhoEtabela();
};

function salvarProdutosNoCarrinho(key, dados) {
    localStorage.setItem(key, JSON.stringify(dados));
};

function obterProdutosDoCarrinho(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
};

function produtoExisteNoCarrinho(carrinho, novoProduto) {
    const itemExiste = carrinho.find(item => item.id === novoProduto.id);
    itemExiste ? itemExiste.quantidade += 1 : carrinho.push(novoProduto);
};

function atualizarContadorDoCarrinho() {
    const carrinho = obterProdutosDoCarrinho("carrinho");
    let total = 0;
    carrinho.forEach(item => total += item.quantidade);

    document.getElementById("contador-carrinho").textContent = total;
};

atualizarContadorDoCarrinho();

function renderizerTabelaCarrinho() {
    const produtosCarrinho = obterProdutosDoCarrinho("carrinho");
    const corpoTabela = document.getElementById("tbody");

    corpoTabela.innerHTML = produtosCarrinho.map(produto => `
    <tr>
        <td class="td-produto">
            <img src="${produto.imagem}" 
                alt="${produto.nome}" 
            />
        </td>
        <td>${produto.nome}</td>
        <td class="td-preco-unitario">
            R$ ${produto.preco.toFixed(2).replace(".", ",")}
        </td>
        <td class="td-quantidade">
            <input type="number" class="input-quantidade" 
                data-id="${produto.id}" 
                value="${produto.quantidade}" min="1"
            >
        </td>
        <td class="td-preco-total">
          R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}
        </td>
        <td>
            <button class="btn-remover" 
                data-id="${produto.id}" id="deletar">
            </button>
        </td>
    </tr>
    `).join("");
}

const corpoTabela = document.getElementById("tbody");
corpoTabela.addEventListener("click", event => {
    if (event.target.classList.contains("btn-remover")) {
        const id = event.target.dataset.id;
        removerProdutoDoCarrinho(id);
    };
});

corpoTabela.addEventListener("input", event => {
    if (event.target.classList.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho("carrinho");
        const produto = produtos.find(produto => produto.id === event.target.dataset.id);
        let novaQuantidade = parseInt(event.target.value);
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        salvarProdutosNoCarrinho("carrinho", produtos);
        atualizarCarrinhoEtabela();
    }
});

function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho("carrinho");
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);

    salvarProdutosNoCarrinho("carrinho", carrinhoAtualizado);
    atualizarCarrinhoEtabela();
};

function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho("carrinho");

    const total = produtos.reduce((soma, produto) => {
        return soma + (produto.preco * produto.quantidade);
    }, 0);

    document.getElementById("total-carrinho").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
};

function atualizarCarrinhoEtabela() {
    atualizarContadorDoCarrinho();
    renderizerTabelaCarrinho();
    atualizarValorTotalDoCarrinho();
};

atualizarCarrinhoEtabela();