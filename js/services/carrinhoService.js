export function salvarProdutosNoCarrinho(key, dados) {
    localStorage.setItem(key, JSON.stringify(dados));
};

export function obterProdutosDoCarrinho(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
};

export function produtoExisteNoCarrinho(carrinho, novoProduto) {
    const itemExiste = carrinho.find(item => item.id === novoProduto.id);
    itemExiste ? itemExiste.quantidade += 1 : carrinho.push(novoProduto);
};

function atualizarContadorDoCarrinho() {
    const carrinho = obterProdutosDoCarrinho("carrinho");
    const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0)

    document.getElementById("contador-carrinho").textContent = total;
};

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
};

export function removerProdutoDoCarrinho(id) {
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

    document.getElementById("total-carrinho").textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
    document.querySelector("#subtotal-pedidos .valor").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
};

export function atualizarCarrinhoEtabela() {
    atualizarContadorDoCarrinho();
    renderizerTabelaCarrinho();
    atualizarValorTotalDoCarrinho();
};