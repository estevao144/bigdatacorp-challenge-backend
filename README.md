# Desafio Técnico - Processamento em Lote (Batch JSONL para CSV)

Este projeto consiste em uma solução em Node.js desenvolvida para realizar o processamento eficiente em lote (*batch processing*) de arquivos estruturados no formato JSONL (`.jsonl`) e transformá-los em dois arquivos tabulares CSV (`clubs.csv` e `players.csv`).

A aplicação foi projetada focando em **baixo consumo de memória RAM**, **alta performance** e **resiliência contra dados malformados**, sendo capaz de processar arquivos com milhões de registros sem estourar os limites de recursos da máquina.

---

## 🛠️ Arquitetura e Decisões Técnicas

- **Processamento via Streams (`node:readline` e `node:fs`)**:
  Em vez de carregar todo o arquivo JSONL na memória RAM (o que causaria erros de *Out of Memory* em bases de dados gigantes), o arquivo é lido linha a linha utilizando `readline` sobre um *ReadStream*.
- **Controle de Vazão (*Backpressure*)**:
  Para evitar o acúmulo de dados na memória quando a velocidade de leitura for superior à velocidade de gravação em disco, o script monitora o retorno das funções `.write()` dos *WriteStreams* de saída, aplicando `pause()` e `resume()` dinamicamente nos fluxos de dados.
- **Isolamento de Regras de Negócio**:
  O código foi modularizado separando a lógica de leitura do arquivo, o parsing/validação e a transformação das regras específicas de clubes e jogadores.
- **Robustez e Resiliência**:
  Linhas malformadas no JSONL são capturadas e tratadas individualmente, garantindo que um registro corrompido não interrompa o processamento dos demais registros válidos.

---

## 🚀 Pré-requisitos e Instalação

### Pré-requisitos
- **Node.js**: Versão 18.x ou superior.
- **npm** (gerenciador de pacotes do Node.js).

### Instalação

1. Clone este repositório para a sua máquina local:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd <NOME_DA_PASTA_DO_REPOSITORIO>
   ```

2. Instale as dependências do projeto (se houver):
   ```bash
   npm install
   ```

---

## 💻 Como Executar

O caminho do arquivo de entrada no formato JSONL deve ser passado obrigatoriamente como parâmetro de linha de comando (CLI) ao executar a aplicação.

### Comando de Execução

```bash
node src/main.js "C:\Users\Estevao\Documents\desafio\sample_clubes.jsonl"
```

*(Também é possível utilizar caminhos relativos ao projeto, como `node src/main.js ./input/sample_clubes.jsonl`)*.

---

## 📊 Exemplos de Retorno e Comportamento

### 1. Sucesso no Processamento
Quando o arquivo informado existe e o caminho é válido, a aplicação processa todas as linhas de forma streaming e gera os dois arquivos CSV formatados na pasta `output/`:

- `output/clubs.csv` (Relação 1:1 dos clubes filtrados pelas Série A e Série B, contendo a lista de cores separada por `|`).
- `output/players.csv` (Relação 1:N com os jogadores vinculados aos seus respectivos clubes).

Exemplo de saída no console:
```text
Iniciando processamento do arquivo: C:\Users\Estevao\Documents\desafio\sample_clubes.jsonl ...
Processamento concluído com sucesso!
Arquivos gerados na pasta 'output/':
  - output/clubs.csv
  - output/players.csv
```

### 2. Tratamento de Erro (Arquivo não encontrado)
Caso o caminho passado via parâmetro seja inválido ou o arquivo não exista no sistema de arquivos, a aplicação captura o erro e exibe a mensagem correspondente no terminal sem quebrar a execução de forma genérica:

Exemplo de comando com caminho inválido:
```bash
node src/main.js "C:\Users\Estevao\Documents\desafio\testez\sample_clubes.jsonl"
```

Saída de erro exibida no console:
```text
Erro ao ler o arquivo: ENOENT: no such file or directory, open 'C:\Users\Estevao\Documents\desafio\testez\sample_clubes.jsonl'
```

---

## 📄 Regras de Negócio Implementadas

1. **Filtro por Campeonato**: Apenas clubes disputando a **Série A** ou **Série B** são incluídos em `clubs.csv`. Clubes de outros campeonatos (e seus jogadores) são descartados.
2. **Formatação de Cores**: Os itens do array `colors` são unidos utilizando o delimitador `|` (ex: `preto|branco`).
3. **Formatação de Datas**: As datas mantêm o formato padrão `yyyy-MM-dd`. Caso uma data seja inválida, o campo permanece vazio.
4. **Tratamento de CSV (RFC 4180)**: Campos que possuem vírgulas, aspas ou quebras de linha são devidamente escapados entre aspas duplas.
5. **Mapeamento Estrito de Colunas**: Apenas as colunas especificadas na documentação do desafio são exportadas, ignorando chaves adicionais presentes no JSON de entrada.
