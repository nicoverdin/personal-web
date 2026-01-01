import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/portfolio/articles.module';
import { TagsModule } from './modules/tags/tags.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', 
    validationSchema: envValidationSchema,
  }), PortfolioModule, UsersModule, AuthModule, ArticlesModule, TagsModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
