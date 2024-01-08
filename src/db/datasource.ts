import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { User } from 'src/users/entities/user.entity'
import { DataSource, DataSourceOptions } from 'typeorm'

config({ path: `.env` })

const configService = new ConfigService()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: configService.get<number>('DATABASE_PORT'),
  synchronize: false,
  logging: true,
  url: configService.get<string>('DATABASE_URL'),
  entities: [User]
}

const dataSource = new DataSource(dataSourceOptions)
dataSource
  .initialize()
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.error(err)
  })
export default dataSource
