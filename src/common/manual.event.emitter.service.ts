import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent } from 'rxjs';

@Injectable()
export class ManualEventEmitterService {
    private readonly emitter = new EventEmitter2();
    // constructor(
    //     // Inject some Service here and everything about sse will stop to work.
    // ) {
    // }
    subscribe(channel: string) {
        return fromEvent(this.emitter, channel);
    }
    emit(channel: string, data?: object) {
        this.emitter.emit(channel, { data });
    }
}
