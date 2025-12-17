import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { AwsClient } from './client/aws.client';
import { AzureClient } from './client/azure.client';
import { CloudController } from './controller/cloud.controller';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './service/file.service';

const clientProvider = {
  provide: 'CLIENT',
  useClass: process.env.CLIENT === 'AWS' ? AwsClient : AzureClient,
};

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, CloudController],
  providers: [AppService, clientProvider, FileService],
})
export class AppModule {}
