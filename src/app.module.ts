import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { EnvConfiguration } from './config/configuration'
// modules
import { MongooseModule } from '@nestjs/mongoose'
import { PokemonModule } from './pokemon/pokemon.module'
import { CommonModule } from './common/common.module'
import { SeedModule } from './seed/seed.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [EnvConfiguration] }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db.url')
      }),
      inject: [ConfigService]
    }),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  constructor(private configService: ConfigService) {}
}
