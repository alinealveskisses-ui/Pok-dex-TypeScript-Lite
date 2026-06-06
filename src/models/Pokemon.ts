// Contrato do que esperamos receber da PokeAPI
export interface PokemonApiResponse {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

// Estrutura simplificada que será salva no pc_box.json
export interface PokemonResumo {
  id: number;
  nome: string;
  tipos: string[];
  hp: number;
  ataque: number;
  defesa: number;
}