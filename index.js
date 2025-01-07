import inquirer from "inquirer";
import { adicionar, listar, atualizar, excluir, buscar,} from "./crud.js";

//Menu para navegar entre opcoes
export const menu = async () => {
  console.log("\nLoja AgilStore - Estoque\n");
  const resposta = await inquirer.prompt([
    {
      type: "list",
      name: "op",
      message: "Selecione uma opção:",
      choices: [
        "Adicionar Produto",
        "Listar Produtos",
        "Atualizar Produto",
        "Excluir Produto",
        "Buscar Produto",
        "Sair",
      ],
    },
  ]);

  switch (resposta.op) {
    case "Adicionar Produto":
      return adicionar();
    case "Listar Produtos":
      return listar();
    case "Atualizar Produto":
      return atualizar();
    case "Excluir Produto":
      return excluir();
    case "Buscar Produto":
      return buscar();
    case "Sair":
      process.exit();
  }
};

await menu();
