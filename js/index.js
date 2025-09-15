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
};

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

    document.getElementById("total-carrinho").textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
    document.querySelector("#subtotal-pedidos .valor").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
};

function atualizarCarrinhoEtabela() {
    atualizarContadorDoCarrinho();
    renderizerTabelaCarrinho();
    atualizarValorTotalDoCarrinho();
};

atualizarCarrinhoEtabela();

async function calcularFrete(cep) {
    const url = "https://jessica1914tj.app.n8n.cloud/webhook/0319a495-feff-44f8-ad02-0cbe5a039cb5";

    try {
        const medidasResponse = await fetch("./js/medidas-produtos.json")
        const medidas = await medidasResponse.json()
        const produtos = obterProdutosDoCarrinho("carrinho");

        const products = produtos.map(produto => {
            const medida = medidas.find(m => m.id === produto.id);
            return {
                quantity: produto.quantidade,
                height: medida ? medida.height : 4,
                length: medida ? medida.length : 30,
                width: medida ? medida.width : 25,
                weight: medida ? medida.weight : 0.25
            }
        });

        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cep, products })
        });

        if (!resposta.ok) throw new Error("Erro ao calcular frete");

        const resultado = await resposta.json();
        console.log(resultado);

        return resultado.price;
    } catch (erro) {
        console.log("Erro ao calcular frete:", erro);
        return null;
    }
};

const btnCalcularFrete = document.getElementById("btn-calcular-frete");
const inputCep = document.getElementById("input-cep");

inputCep.addEventListener("keydown", (event) => {
    if (event.key === "Enter") btnCalcularFrete.click();
});

btnCalcularFrete.addEventListener("click", async () => {
    const cep = inputCep.value.trim();
    const erroCep = document.querySelector(".erro");

    if (!validarCep(cep)) {
        erroCep.textContent = "CEP inválido";
        erroCep.style.display = "block";
        return;
    } else {
        erroCep.style.display = "none";
    }

    const loading = document.getElementById("loading-frete");
    loading.style.display = "inline";

    const valorFrete = await calcularFrete(cep);
    loading.style.display = "none";

    if (valorFrete === null) {
        erroCep.textContent = "Erro ao calcular frete. Tente novamente.";
        erroCep.style.display = "block";
        return;
    };

    document.querySelector("#valor-frete .valor").textContent = 
        valorFrete.toLocaleString("pt-BR", {
        style: "currency", currency: "BRL"
    });
    document.querySelector("#valor-frete").style.display = "flex";

    const subtotalElemento = document.querySelector("#subtotal-pedidos .valor");

    let textoSubtotal = subtotalElemento.textContent.trim();
    textoSubtotal = textoSubtotal.replace("R$", "").trim();
    const valorSubtotal = parseFloat(textoSubtotal
        .replace(/\./g, "")
        .replace(",", "."));

    const totalComFrete = valorSubtotal + valorFrete;
    const totalComFreteFormatado = totalComFrete
        .toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL'
    });

    const totalCarrinhoElemento = document.getElementById("total-carrinho");
    totalCarrinhoElemento.textContent = `Total: ${totalComFreteFormatado}`;
});

function validarCep(cep) {
    const regexCep = /^[0-9]{5}-?[0-9]{3}$/;
    return regexCep.test(cep);
};