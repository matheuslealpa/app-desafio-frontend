$(document).ready(function () {
    // Evento ao perder o foco do campo CEP
    $('#cep').blur(function () {
        var cep = $(this).val().replace(/\D/g, '');

        if (cep.length !== 8) {
            alert('CEP inválido.');
            return;
        }

        // Requisição para obter dados do CEP
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

// Evento ao clicar no botão para adicionar anexo
$(document).ready(function () {
    $('#adicionarAnexo').click(function () {
        $('#fileInput').click(); // Simular clique no input de arquivo
    });

    // Manipular mudança no input de arquivo
    $('#fileInput').change(function () {
        var file = this.files[0]; // Obter o arquivo selecionado
        if (file) {
            // Armazenar o arquivo no localStorage
            var reader = new FileReader();
            reader.onload = function (event) {
                var fileData = event.target.result;
                localStorage.setItem('anexo', fileData);
                adicionarAnexo(file.name);
            };
            reader.readAsDataURL(file);
        }
    });

    function adicionarAnexo(fileName) {
        var anexoHtml = `
            <div class="anexo">
                <i class="far fa-eye visualizar-anexo" title="Visualizar Anexo"></i>
                <i class="far fa-trash-alt excluir-anexo" title="Excluir Anexo"></i>
                <span>${fileName}</span>
            </div>
        `;
        $('#anexos').append(anexoHtml);
    }

    $('#anexos').on('click', '.excluir-anexo', function () {
        localStorage.removeItem('anexo');
        $(this).closest('.anexo').remove();
    });

    $('#anexos').on('click', '.visualizar-anexo', function () {
        var fileData = localStorage.getItem('anexo');
        if (fileData) {
            alert("Simulando a visualização do arquivo: " + fileData);
        }
    });
});

$(document).ready(function () {
    $('#salvarFornecedor').click(function () {
        salvarFornecedor();
    });
});


function validarCamposObrigatorios() {
    var camposObrigatoriosPreenchidos = true;
    $('.required').each(function () {
        if ($(this).val().trim() === '') {
            camposObrigatoriosPreenchidos = false;
            alert('Por favor, preencha todos os campos obrigatórios.');
            return false; // Sair do loop se algum campo estiver vazio
        }
    });

    return camposObrigatoriosPreenchidos;
}


function salvarFornecedor() {
    var fornecedor = {
        razaoSocial: $('#razaoSocial').val(),
        nomeFantasia: $('#nomeFantasia').val(),
        cnpj: $('#cnpj').val(),
        inscricaoEstadual: $('#inscricaoEstadual').val(),
        inscricaoMunicipal: $('#inscricaoMunicipal').val(),
        nomeContato: $('#pessoaContato').val(),
        telefoneContato: $('#telefone').val(),
        emailContato: $('#email').val(),
        produtos: [],
        anexos: []
    };

    // Obter produtos
    $('.produto').each(function (index) {
        var produto = {
            indice: index + 1,
            descricaoProduto: $(this).find('input[name="descricao"]').val(),
            unidadeMedida: $(this).find('select[name="unidadeMedida"]').val(),
            qtdeEstoque: $(this).find('input[name="quantidadeEstoque"]').val(),
            valorUnitario: $(this).find('input[name="valorUnitario"]').val(),
            valorTotal: $(this).find('input[name="valorTotal"]').val()
        };
        fornecedor.produtos.push(produto);
    });

    // Obter anexos
    $('.anexo').each(function (index) {
        var anexo = {
            indice: index + 1,
            nomeArquivo: $(this).find('span').text(),
            blobArquivo: localStorage.getItem('anexo')
        };
        fornecedor.anexos.push(anexo);
    });
    console.log(JSON.stringify(fornecedor, null, 4));
}


$(document).ready(function () {
    // Função para adicionar um produto
    function adicionarProduto() {
        var produtoHtml = `
            <div class="form-row produto border">
                <div class="form-group col-md-12">
                    <label for="descricao">Descrição<span class="text-danger required">*</span>:</label>
                    <input type="text" class="form-control" name="descricao" required>
                    <span class="error-message">Este campo é obrigatório.</span>
                </div>
                <div class="form-group col-md-3">
                    <label for="unidadeMedida">Unidade de Medida<span class="text-danger required">*</span>:</label>
                    <select class="form-control" name="unidadeMedida" required>
                        <option value="">Selecione...</option>
                        <option value="un">Unidade</option>
                        <option value="kg">Quilograma</option>
                    </select>
                    <span class="error-message">Este campo é obrigatório.</span>
                </div>
                <div class="form-group col-md-3">
                    <label for="quantidadeEstoque">Quantidade em Estoque<span class="text-danger required">*</span>:</label>
                    <input type="number" class="form-control" name="quantidadeEstoque" value="0" required>
                    <span class="error-message">Este campo é obrigatório.</span>
                    </div>
                <div class="form-group col-md-3">
                    <label for="valorUnitario">Valor Unitário<span class="text-danger required">*</span>:</label>
                    <input type="number" class="form-control" name="valorUnitario" value="0" required>
                    <span class="error-message">Este campo é obrigatório.</span>
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


$(document).ready(function() {
    $('#salvarFornecedor').click(function() {
      // Abrir o modal de loading
      $('#loadingModal').modal('show');
      
      // Formatar os dados em JSON e enviar
      enviarDados();
    });
  });
  
  function enviarDados() {
    // Formatar os dados em JSON
    var dados = salvarFornecedor();
  
    setTimeout(function() {
      $('#loadingModal').modal('hide');
      
      alert('Dados enviados com sucesso!');
    }, 2000);
  }
  
  