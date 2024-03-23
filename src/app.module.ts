import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'
import { PokemonModule } from './pokemon/pokemon.module'
import { CommonModule } from './common/common.module'
import { SeedModule } from './seed/seed.module'
import { EnvConfiguration } from './config/configuration'

const mongodbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017/nest?authSource=admin`

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [EnvConfiguration] }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRoot(mongodbUrl),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  constructor() {
    const { DB_USER, DB_PASSWORD, PORT } = process.env
    console.log({ DB_USER, DB_PASSWORD, PORT })
  }
}
