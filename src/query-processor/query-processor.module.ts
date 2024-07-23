import { Module } from '@nestjs/common';
import { QueryProcessorService } from './query-processor.service';
import { OpenaiService } from '../open-ai/openai.service';

@Module({
  providers: [QueryProcessorService, OpenaiService],
})
export class QueryProcessorModule {}
