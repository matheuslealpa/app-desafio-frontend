$(document).ready(function () {
    $('#cep').blur(function () {
        var cep = $(this).val().replace(/\D/g, '');

        if (cep.length !== 8) {
            alert('CEP inválido.');
            return;
        }

        $.getJSON('https://viacep.com.br/ws/' + cep + '/json/', function (data) {
            if (!("erro" in data)) {
                $('#endereco').val(data.logradouro);
                $('#bairro').val(data.bairro);
                $('#cidade').val(data.localidade);
                $('#estado').val(data.uf);
                $('#numero').focus();
            } else {
                alert('CEP não encontrado.');
            }
        });
    });
});

$(document).ready(function () {
    // Função para adicionar um produto
    function adicionarProduto() {
        var produtoHtml = `
            <div class="form-row produto border">
                <div class="form-group col-md-12">
                    <label for="descricao">Descrição<span class="text-danger">*</span>:</label>
                    <input type="text" class="form-control" name="descricao" required>
                </div>
                <div class="form-group col-md-3">
                    <label for="unidadeMedida">Unidade de Medida<span class="text-danger">*</span>:</label>
                    <select class="form-control" name="unidadeMedida" required>
                        <option value="">Selecione...</option>
                        <option value="un">Unidade</option>
                        <option value="kg">Quilograma</option>
                    </select>
                </div>
                <div class="form-group col-md-3">
                    <label for="quantidadeEstoque">Quantidade em Estoque<span class="text-danger">*</span>:</label>
                    <input type="number" class="form-control" name="quantidadeEstoque" value="0" required>
                </div>
                <div class="form-group col-md-3">
                    <label for="valorUnitario">Valor Unitário<span class="text-danger">*</span>:</label>
                    <input type="number" class="form-control" name="valorUnitario" value="0" required>
                </div>
                <div class="form-group col-md-3">
                    <label for="valorTotal">Valor Total<span class="text-danger">*</span>:</label>
                    <input type="text" class="form-control" name="valorTotal" readonly>
                </div>
                <i class="far fa-trash-alt delete-icon" title="Excluir Produto"></i>
            </div>
        `;
        $('#produtos').append(produtoHtml);

        // Atualiza o valor total automaticamente ao alterar a quantidade ou o valor unitário
        $('.produto input[name="quantidadeEstoque"], .produto input[name="valorUnitario"]').on('input', function () {
            var quantidade = $(this).closest('.produto').find('input[name="quantidadeEstoque"]').val();
            var valorUnitario = $(this).closest('.produto').find('input[name="valorUnitario"]').val();
            var valorTotal = quantidade * valorUnitario;
            $(this).closest('.produto').find('input[name="valorTotal"]').val(valorTotal.toFixed(2));
        });

        // Excluir produto ao clicar no ícone de lixeira
        $('.delete-icon').on('click', function () {
            $(this).closest('.produto').remove();
        });
    }

    // Adiciona um produto ao clicar no botão "Adicionar Produto"
    $('#adicionarProduto').on('click', function () {
        adicionarProduto();
    });

    // Validação do formulário
    $('#cadastroForm').submit(function () {
        var produtos = $('.produto');
        if (produtos.length === 0) {
            alert('É obrigatório adicionar pelo menos 1 produto.');
            return false; // Impede o envio do formulário se nenhum produto foi adicionado
        }
    });
});
