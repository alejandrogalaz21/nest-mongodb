import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'

import { isValidObjectId, Model } from 'mongoose'
import { Pokemon } from './entities/pokemon.entity'

import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { PaginationDTO } from '../common/dto/pagination.dto'

@Injectable()
export class PokemonService {
  private limit: number
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private configService: ConfigService
  ) {
    this.limit = this.configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(pagination: PaginationDTO) {
    try {
      const { limit = this.limit, offset = 0 } = pagination
      return await this.pokemonModel
        .find()
        .limit(limit)
        .skip(offset)
        .sort({ no: 1 })
        .select('-__v')
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim()
      })
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`
      )

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term)
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase()

      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id };
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    return
  }

  async insertMany(pokemons: CreatePokemonDto[]) {
    try {
      const pokemonsInserted = this.pokemonModel.insertMany(pokemons)
      return pokemonsInserted
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async count() {
    try {
      const count = await this.pokemonModel.countDocuments()
      return count
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`
      )
    }
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`
    )
  }
}
