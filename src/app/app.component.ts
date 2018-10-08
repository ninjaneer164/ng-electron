import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';

    private get _ipc(): any {
        return electron.ipcRenderer;
    }

    constructor() {
        this._ipc.on('message', (event, data) => {
            console.log(data);
        });
        this._ipc.send('initComplete');
    }
}
