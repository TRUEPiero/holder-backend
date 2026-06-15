export abstract class Entity {
    protected id: number

    constructor(params: any) {
        this.id = params.id
    }

    getId() {
        return this.id
    }

    abstract response(): any
}