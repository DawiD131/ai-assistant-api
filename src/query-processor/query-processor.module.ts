import { Module } from '@nestjs/common';
import { QueryProcessorService } from './query-processor.service';
import { ActionProcessorService } from '../action-processor/action-processor.service';
import { OpenaiService } from '../open-ai/openai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitter2],
  providers: [QueryProcessorService, ActionProcessorService, OpenaiService],
})
export class QueryProcessorModule {}
