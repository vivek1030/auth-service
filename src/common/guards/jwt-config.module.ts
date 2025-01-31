import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret', // Use environment variable for JWT secret
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' }, // JWT expiration
    }),
  ],
  exports: [JwtModule], // Export JwtModule to make it available in other modules
})
export class JwtConfigModule {}
