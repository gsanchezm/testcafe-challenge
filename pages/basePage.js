import {Selector, t} from 'testcafe'

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

    async #getElement(element){
        return Selector(element);
    }

    async clickOnElement(element){
        await t.click(await this.#getElement(element));
    }

    async enterText(element,text){
        await t.typeText(await this.#getElement(element),text);
    }

    async selectFromDropDown(element, selection){
        await t.click((await this.#getElement(element))).click((await this.#getElement(element)).find('option').withText(selection));
    }
}