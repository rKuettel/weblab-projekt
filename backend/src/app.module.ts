import { Module } from '@nestjs/common';
import { AppService } from './app.service.js';
import { TrackerModule } from './tracker/tracker.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DB_NAME = 'track-thing';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        user: config.get<string>('MONGODB_USER'),
        pass: config.get<string>('MONGODB_PASS'),
        dbName: DB_NAME,
      }),
    }),
    TrackerModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
