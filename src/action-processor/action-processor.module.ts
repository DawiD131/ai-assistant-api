import { Module } from '@nestjs/common';
import { ActionProcessorService } from './action-processor.service';
import { OpenaiService } from '../open-ai/openai.service';

@Module({
  providers: [ActionProcessorService, OpenaiService],
})
export class ActionProcessorModule {}
