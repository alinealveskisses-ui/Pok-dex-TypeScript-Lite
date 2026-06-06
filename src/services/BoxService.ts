import { readFile, writeFile } from 'node:fs/promises';
import { PokemonResumo } from '../models/Pokemon.js';

export class BoxService {
  // Caminho relativo a partir da raiz do projeto onde o comando será executado
  private filePath = './pc_box.json';

  // Método utilitário privado para ler o arquivo local
  private async lerArquivo(): Promise<PokemonResumo[]> {
    try {
      const dados = await readFile(this.filePath, 'utf-8');
      return JSON.parse(dados) as PokemonResumo[];
    } catch (erro) {
      // Se der erro (ex: arquivo corrompido), retorna um array vazio para não quebrar a app
      return [];
    }
  }

  // Método utilitário privado para salvar as alterações no arquivo local
  private async salvarArquivo(lista: PokemonResumo[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(lista, null, 2), 'utf-8');
  }

  // 1. Listar todos os Pokémon salvos
  async listar(): Promise<PokemonResumo[]> {
    return await this.lerArquivo();
  }

  // 2. Adicionar um novo Pokémon (Impedindo registros duplicados)
  async adicionar(pokemon: PokemonResumo): Promise<boolean> {
    const box = await this.lerArquivo();
    
    // Verifica se já existe um Pokémon com o mesmo ID no arquivo
    const jaExiste = box.some((p) => p.id === pokemon.id);
    
    if (jaExiste) {
      return false; // Retorna falso informando que não foi adicionado por duplicidade
    }

    box.push(pokemon);
    await this.salvarArquivo(box);
    return true; // Sucesso
  }

  // 3. Remover Pokémon do catálogo local por ID
  async remover(id: number): Promise<boolean> {
    const box = await this.lerArquivo();
    
    // Filtra a lista mantendo apenas os que NÃO têm o ID informado
    const novaLista = box.filter((p) => p.id !== id);

    // Se o tamanho da lista não mudou, significa que o ID não existia lá
    if (novaLista.length === box.length) {
      return false;
    }

    await this.salvarArquivo(novaLista);
    return true; // Sucesso na remoção
  }
}