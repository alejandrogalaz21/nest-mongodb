import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'
import { PokemonModule } from './pokemon/pokemon.module'
import { CommonModule } from './common/common.module';

const mongodbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017/nest?authSource=admin`

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRoot(mongodbUrl),
    PokemonModule,
    CommonModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
