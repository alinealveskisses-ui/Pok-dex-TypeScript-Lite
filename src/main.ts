import { PokeApiService } from './services/PokeApiService.js';
import { BoxService } from './services/BoxService.js';
import { TerminalController } from './controllers/TerminalController.js';

async function main() {
  // Instancia os serviços (as dependências)
  const pokeApiService = new PokeApiService();
  const boxService = new BoxService();

  // Injeta as dependências no Controller (cumprindo o requisito arquitetural)
  const app = new TerminalController(pokeApiService, boxService);

  // Inicia o loop principal do menu no terminal
  await app.iniciar();
}

// Executa a aplicação capturando possíveis erros globais inesperados
main().catch((erro) => {
  console.error('Ocorreu um erro fatal na aplicação:', erro);
});