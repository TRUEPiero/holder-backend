

export class Event {
    private schelude: string;
    private entity: string;
    private action: string;

    constructor(params: any) {
        this.schelude = params.schelude
        this.entity = params.entity
        this.action = params.action
    }

    getSchelude() {
        return this.schelude;
    }
    
    getKey() {
        return `${this.entity}.${this.action}`
    }
}