import {
    Component,
    OnInit
} from '@angular/core';
import {
    Event,
    EventType
} from './_core';
import {
    IpcService
} from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';

    constructor(
        private ipcService: IpcService
    ) {
        this.ipcService.ipcEvent.subscribe((event: Event) => {
            console.log(event);
        });
    }

    ngOnInit() {
        this.ipcService.send({
            type: EventType.INIT_COMPLETE
        });
    }
}
