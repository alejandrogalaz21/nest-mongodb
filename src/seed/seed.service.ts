import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces'
import { PokemonService } from 'src/pokemon/pokemon.service'

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios
  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    try {
      const { length } = await this.pokemonService.findAll()

      if (!length) {
        const { data } = await this.axios.get<PokeResponse>(
          'https://pokeapi.co/api/v2/pokemon?limit=20'
        )

        data.results.forEach(({ name, url }) => {
          const segments = url.split('/')
          const no = parseInt(segments[segments.length - 2])
          console.log({ name, no })
          this.pokemonService.create({ name, no })
        })
        return 'Seed executed'
      }
      return `No need to executed, ${length} Pokemons existing in the db`
    } catch (error) {
      console.log(error)
    }
  }
}
