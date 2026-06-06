import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { PokeApiService } from '../services/PokeApiService.js';
import { BoxService } from '../services/BoxService.js';

export class TerminalController {
  // Injeção de dependências via construtor (Exatamente como o enunciado exige)
  constructor(
    private pokeApiService: PokeApiService,
    private boxService: BoxService
  ) {}

  // Método principal que mantém o loop do menu ativo
  async iniciar(): Promise<void> {
    // Cria a interface de leitura do terminal
    const rl = createInterface({ input, output });
    let continuar = true;

    while (continuar) {
      console.log('\n=====================================');
      console.log('       POKÉDEX TYPESCRIPT LITE       ');
      console.log('=====================================');
      console.log('1. Buscar Pokémon na API (e salvar)');
      console.log('2. Listar Pokémon salvos na Box');
      console.log('3. Remover Pokémon da Box');
      console.log('4. Sair');
      console.log('=====================================');
      
      const opcao = await rl.question('Escolha uma opção: ');

      switch (opcao.trim()) {
        case '1':
          const termo = await rl.question('Digite o Nome ou ID do Pokémon: ');
          console.log('\nBuscando na PokeAPI...');
          const pokemon = await this.pokeApiService.buscarPokemon(termo);

          if (!pokemon) {
            console.log('❌ Pokémon não encontrado ou falha na API.');
          } else {
            console.log(`\n✨ Encontrado: ${pokemon.nome.toUpperCase()} (ID: ${pokemon.id})`);
            console.log(`Tipos: ${pokemon.tipos.join(', ')} | HP: ${pokemon.hp} | ATK: ${pokemon.ataque} | DEF: ${pokemon.defesa}`);
            
            const salvar = await rl.question('Deseja salvar no catálogo local? (s/n): ');
            if (salvar.toLowerCase() === 's') {
              const sucesso = await this.boxService.adicionar(pokemon);
              if (sucesso) {
                console.log('✅ Pokémon salvo com sucesso no pc_box.json!');
              } else {
                console.log('⚠️ Atenção: Este Pokémon já está cadastrado no seu catálogo!');
              }
            }
          }
          break;

        case '2':
          console.log('\n--- SEUS POKÉMONS SALVOS ---');
          const lista = await this.boxService.listar();
          if (lista.length === 0) {
            console.log('Sua Box está vazia. Cadastre alguns Pokémon primeiro!');
          } else {
            lista.forEach(p => {
              console.log(`[ID: ${p.id}] ${p.nome.toUpperCase()} - Tipos: ${p.tipos.join('/')} | HP: ${p.hp} | ATK: ${p.ataque} | DEF: ${p.defesa}`);
            });
          }
          break;

        case '3':
          const idParaRemover = await rl.question('Digite o ID do Pokémon que deseja remover: ');
          const idNumero = Number(idParaRemover);

          if (isNaN(idNumero)) {
            console.log('❌ Por favor, digite um ID numérico válido.');
          } else {
            const removido = await this.boxService.remover(idNumero);
            if (removido) {
              console.log(`✅ Pokémon com ID ${idNumero} foi removido da sua Box.`);
            } else {
              console.log('❌ ID não encontrado no catálogo local.');
            }
          }
          break;

        case '4':
          console.log('\nObrigado por usar a Pokédex TypeScript Lite! Encerrando...');
          continuar = false;
          break;

        default:
          console.log('❌ Opção inválida. Tente novamente.');
      }
    }

    rl.close(); // Fecha o terminal de forma limpa ao sair
  }
}