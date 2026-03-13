import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule], // JwtModule dynamically configd in app shouldn't be overridden but we inject it
  providers: [TrackingGateway],
  exports: [TrackingGateway],
})
export class TrackingModule {}
