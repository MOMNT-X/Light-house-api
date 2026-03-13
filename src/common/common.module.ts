import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Using 'any' cast on expiresIn to bypass the branded StringValue type from @types/ms
// This is safe — NestJS/jsonwebtoken accepts plain strings like '15m', '7d'
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: (config: ConfigService): any => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class CommonModule {}
