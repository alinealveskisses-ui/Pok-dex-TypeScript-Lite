import { PokemonApiResponse, PokemonResumo } from '../models/Pokemon.js';

export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  // RF04 – Buscar Pokémon na PokeAPI
  async buscarPokemon(nomeOuId: string): Promise<PokemonResumo | null> {
    try {
      // Força o termo de busca para minúsculo e remove espaços extras
      const termo = nomeOuId.toLowerCase().trim();
      
      // Faz a requisição assíncrona usando o fetch nativo do Node.js
      const resposta = await fetch(`${this.baseUrl}/${termo}`);

      // Se retornar 404, o Pokémon não foi encontrado
      if (resposta.status === 404) {
        return null;
      }

      if (!resposta.ok) {
        throw new Error('Falha ao conectar com a PokeAPI.');
      }

      const dados = (await resposta.json()) as PokemonApiResponse;

      // Mapeia e extrai os stats específicos com tipagem explícita para o Strict Mode
      const hp = dados.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0;
      const ataque = dados.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0;
      const defesa = dados.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0;

      // Retorna o objeto mapeado e simplificado rigorosamente segundo o contrato PokemonResumo
      return {
        id: dados.id,
        nome: dados.name,
        tipos: dados.types.map((t: any) => t.type.name),
        hp,
        ataque,
        defesa
      };
    } catch (erro) {
      console.error('Erro na camada PokeApiService:', erro);
      return null;
    }
  }
}