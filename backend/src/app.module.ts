import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', 
    validationSchema: envValidationSchema,
  }), PortfolioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
