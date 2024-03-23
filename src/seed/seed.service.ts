import { Injectable } from '@nestjs/common'
import { PokeResponse } from './interfaces'
import { PokemonService } from 'src/pokemon/pokemon.service'
import { AxiosAdapter } from 'src/common/adapters/axios.adapter'

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    try {
      const { length } = await this.pokemonService.findAll()

      if (!length) {
        const data = await this.http.get<PokeResponse>(
          'https://pokeapi.co/api/v2/pokemon?limit=20'
        )

        const pokemons = data.results.map(({ name, url }) => {
          const segments = url.split('/')
          const no = parseInt(segments[segments.length - 2])
          return { name, no }
        })

        const docs = await this.pokemonService.insertMany(pokemons)
        console.log(docs)
        return 'Seed executed'
      }
      return `No need to executed, ${length} Pokemons existing in the db`
    } catch (error) {
      console.log(error)
    }
  }
}
