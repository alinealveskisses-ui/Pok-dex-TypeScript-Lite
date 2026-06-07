import { PokeApiService } from './services/PokeApiService.js';
import { CatalogoPokemon } from './controllers/CatalogoPokemon.js';

async function main() {
  const pokeApiService = new PokeApiService();
  const catalogo = new CatalogoPokemon();

  console.log('--- INICIANDO TESTES DA POKÉDEX ---\n');

  // 1. RF04, RF06 & RF08 - Teste de Busca Válida e Adição (Pikachu)
  const pikachu = await pokeApiService.buscarPokemon('pikachu');
  if (pikachu !== null) {
    catalogo.adicionar(pikachu);
  }

  // 2. Teste de Segunda Busca Válida (Charmander)
  const charmander = await pokeApiService.buscarPokemon('charmander');
  if (charmander !== null) {
    catalogo.adicionar(charmander);
  }

  console.log('\n--- TESTANDO DUPLICIDADE (RF08) ---');
  // 3. RF08 - Teste de Duplicidade (Tentar adicionar Pikachu de novo)
  const pikachuDuplicado = await pokeApiService.buscarPokemon('pikachu');
  if (pikachuDuplicado !== null) {
    catalogo.adicionar(pikachuDuplicado);
  }

  console.log('\n--- TESTANDO BUSCA INVÁLIDA (RF05) ---');
  // 4. RF05 - Teste de Pokémon Inexistente
  await pokeApiService.buscarPokemon('pokemon-inexistente');

  console.log('\n--- EXIBINDO LISTA ATUAL (RF09) ---');
  // 5. RF09 - Listar catálogo em memória
  catalogo.listar();

  console.log('\n--- TESTANDO REMOÇÃO (RF10 - ID 25 - Pikachu) ---');
  // 6. RF10 - Remover do catálogo por ID
  catalogo.remover(25);

  console.log('\n--- EXIBINDO LISTA APÓS REMOÇÃO ---');
  catalogo.listar();
}

main().catch((erro) => {
  console.error('Erro na execução principal:', erro);
});