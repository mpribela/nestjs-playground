import {Module} from '@nestjs/common';
import {AppController} from './controller/app.controller';
import {AppService} from './service/app.service';
import {AwsClient} from './client/aws.client';
import {AzureClient} from './client/azure.client';
import {CloudController} from './controller/cloud.controller';
import {ConfigModule} from '@nestjs/config';
import {FileService} from './service/file.service';

const getClientClass = () => {
  if (!process.env.CLIENT) {
    throw new Error(`Please define environment variable CLIENT`);
  }
  switch (process.env.CLIENT.toUpperCase()) {
    case 'AWS':
      return AwsClient;
    case 'AZURE':
      return AzureClient;
    default:
      throw new Error(`Unsupported client provided ${process.env.CLIENT}`);
  }
};

const clientProvider = {
  provide: 'CLIENT',
  useClass: getClientClass(),
};

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, CloudController],
  providers: [AppService, clientProvider, FileService],
})
export class AppModule {}
