import { obterProdutosDoCarrinho } from "./carrinhoService.js";

export async function calcularFrete(cep, btnCalcularFrete) {
    const url = "https://jessica1914tj.app.n8n.cloud/webhook/0319a495-feff-44f8-ad02-0cbe5a039cb5";

    const loading = document.getElementById("loading-frete");
    loading.style.display = "inline";
    btnCalcularFrete.disabled = true;

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
        return resultado.price;

    } catch (erro) {
        console.log("Erro ao calcular frete:", erro);
        return null;
    } finally {
        loading.style.display = "none";
        btnCalcularFrete.disabled = false;
    }
};

export function somaValorFreteComSubTotal(valorFrete) {
    const subtotalElemento = document.querySelector("#subtotal-pedidos .valor");

    const textoSubtotal = subtotalElemento.textContent
        .replace("R$", "")
        .trim();

    const valorSubtotal = parseFloat(textoSubtotal
        .replace(/\./g, "")
        .replace(",", ".")
    );

    const totalComFrete = valorSubtotal + valorFrete;
    const totalComFreteFormatado = totalComFrete.toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL'
    });

    const totalCarrinhoElemento = document.getElementById("total-carrinho");
    totalCarrinhoElemento.textContent = `Total: ${totalComFreteFormatado}`;
};