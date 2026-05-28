import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { MongooseModule } from '../database/mongoose/mongoose.module';

@Global()
@Module({
  imports: [MongooseModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
