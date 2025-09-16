import { salvarProdutosNoCarrinho, atualizarCarrinhoEtabela, obterProdutosDoCarrinho, produtoExisteNoCarrinho, removerProdutoDoCarrinho } from "./services/carrinhoService.js";
import { calcularFrete, somaValorFreteComSubTotal } from "./services/freteService.js";
import { validarCep } from "./services/validadorCep.js";


atualizarCarrinhoEtabela();
const btnAdicionarCarrinho = document.querySelectorAll(".add-ao-carrinho");
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

    const valorFrete = await calcularFrete(cep, btnCalcularFrete,);

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

    somaValorFreteComSubTotal(valorFrete)
});