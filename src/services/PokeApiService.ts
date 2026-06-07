import { PokemonApiResponse, PokemonResumo } from '../models/Pokemon.js';

export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  // RF04 & RF05 – Buscar Pokémon na PokeAPI
  async buscarPokemon(nomeOuId: string): Promise<PokemonResumo | null> {
    try {
      const termo = nomeOuId.toLowerCase().trim();
      const resposta = await fetch(`${this.baseUrl}/${termo}`);

      if (resposta.status === 404) {
        console.log(`[ERRO] Pokémon não encontrado: ${nomeOuId}`);
        return null;
      }

      if (!resposta.ok) {
        console.log('[ERRO] Não foi possível buscar o Pokémon.');
        return null;
      }

      const dados = (await resposta.json()) as PokemonApiResponse;

      // RF06 – Mapear o retorno da API para um objeto simplificado
      return {
        id: dados.id,
        nome: dados.name,
        tipos: dados.types.map((item: any) => item.type.name),
        altura: dados.height,
        peso: dados.weight
      };
    } catch (erro) {
      console.log('[ERRO] Não foi possível buscar o Pokémon.');
      return null;
    }
  }
}