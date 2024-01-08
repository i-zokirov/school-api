import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

config({ path: `.env` })

const configService = new ConfigService()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: configService.get<number>('DATABASE_PORT'),
  synchronize: false,
  logging: true,
  url: configService.get<string>('DATABASE_URL'),
  entities: ['dist/**/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js']
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
