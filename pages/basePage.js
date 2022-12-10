import {t} from 'testcafe'

export class BasePage{

    constructor(){
        this.queue = Promise.resolve();
    }

    _chain (callback) {
        this.queue = this.queue.then(callback);

        return this;
    }

    then (callback) {
        return callback(this.queue);
    }

    async reloadPage(){
        await t.eval(() => location.reload(true));
    }
}