import {
    Injectable
} from '@angular/core';
import {
    Observable,
    Subject
} from 'rxjs';
import {
    Event,
    EventType
} from '../_core';

@Injectable({
    providedIn: 'root'
})
export class IpcService {

    public ipcEvent: Observable<Event>;

    private ipcEventSubject = new Subject<Event>();

    private get _ipc(): any {
        if (electron && electron.ipcRenderer) {
            return electron.ipcRenderer;
        }
        return null;
    }

    constructor() {
        this.ipcEvent = <Observable<Event>>this.ipcEventSubject;

        if (this._ipc) {
            this._ipc.on(EventType.MESSAGE, (event: any, data: Event) => {
                this.ipcEventSubject.next(data);
            });
        }
    }

    public send(event: Event): void {
        if (this._ipc) {
            this._ipc.send(event.type, event);
        }
    }
}
