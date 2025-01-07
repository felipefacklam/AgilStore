import inquirer from "inquirer";
import fs from "fs";
import { menu } from "./index.js"

const arquivo = "produtos.json"; //JSON para persistencia dados

const carregarProdutos = () => {
  try {
      const data = fs.readFileSync(arquivo, "utf-8")
      return JSON.parse(data)
  } catch (error) {
    console.error("Erro ao carregar arquivo:", error)
  }
};

const salvarProdutos = (produtos) => {
  try {
    fs.writeFileSync(arquivo, JSON.stringify(produtos, null, 2))
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
  }
};

let produtos = carregarProdutos() //carrega json com os produtos
const gerarId = () => Math.random().toString(36).substr(2, 9)//func para gerar os IDs 

//----------------------------------CRUD----------------------------------//
//CREATE
export const adicionar = async () => {
  const resposta = await inquirer.prompt([
    { name: "nome", message: "Nome do Produto:" },
    { name: "categoria", message: "Categoria do Produto:" },
    {//aqui precisou uma verificação mais detalhada para depois sim fazer conversao para numb
      name: "quantidade",
      message: "Quantidade em Estoque:",
      validate: (input) => !isNaN(input) && input >= 0 || "Insira um número válido.",
    },
    {
      name: "preco",
      message: "Preço do Produto:",
      validate: (input) => !isNaN(input) && input >= 0 || "Insira um número válido.",
    },
  ]);

  const novoProduto = {
    id: gerarId(),
    nome: resposta.nome,
    categoria: resposta.categoria,
    quantidade: parseInt(resposta.quantidade),
    preco: parseFloat(resposta.preco),
  }

  produtos.push(novoProduto); //add novo poduto no array
  salvarProdutos(produtos); //atualiza JSON com array atualizado

  console.log("Produto adicionado.")
  await menu()//chama menu novamente
};

//READ tudo lista
export const listar = async () => {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado.");//estoque vazio
  } else {
    console.table(produtos);//printa tabela estoque
  }
  await menu()
};

//UPDATE
export const atualizar = async () => {
  const resposta = await inquirer.prompt([{ name: "id", message: "Informe o ID do Produto para atualizar:" }]); 
  const id = resposta.id;
  const produto = produtos.find((p) => p.id === id); //busca o produto pelo ID inserido
  if (!produto) {
    console.log("Produto não encontrado.") //se não achar o ID
    return menu();
  }

    const res = await inquirer.prompt([ //dados para update
    { name: "nome", message: "Novo nome:",},
    { name: "categoria", message: "Nova categoria:"},
    { name: "quantidade", message: "Nova quantidade: "},
    { name: "preco", message: "Novo preço:"},
  ]);

  produto.nome = res.nome //insere novos dados no produto
  produto.categoria = res.categoria
  produto.quantidade = parseInt(res.quantidade)
  produto.preco = parseFloat(res.preco)

  salvarProdutos(produtos) //atualiza JSON
  console.log("Produto atualizado.");
  await menu()
};

//DELETE
export const excluir = async () => {
  const resposta = await inquirer.prompt([{ name: "id", message: "Informe o ID do Produto para excluir:" }]);
  const id = resposta.id;

  const index = produtos.findIndex((p) => p.id === id); //busca pelo ID
  if (index === -1) { //verifica se encontra o index
    console.log("Produto não encontrado.");
  } else { //se encontrar...
    produtos.splice(index, 1)//remove produto do array
    salvarProdutos(produtos)//atualiza JSON com array
    console.log("Produto excluído.");
  }
  await menu()
};

//READ por pesquisa
export const buscar = async () => {
  const resposta = await inquirer.prompt([{ name: "busca", message: "Informe o ID ou o nome do produto:" }]);
  const busca = resposta.busca;

  const resultados = produtos.filter(//busca pelos resultados
    (p) => p.id.includes(busca) || p.nome.toLowerCase().includes(busca.toLowerCase())
  ) //formata pra minuscula
  if (resultados.length === 0) {
    console.log("Nenhum produto encontrado.");
  } else {
    console.table(resultados);
  }
  await menu()
};
