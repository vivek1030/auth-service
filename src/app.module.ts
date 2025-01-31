import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { databaseConfig } from './shared/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    PassportModule,
    AuthModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
