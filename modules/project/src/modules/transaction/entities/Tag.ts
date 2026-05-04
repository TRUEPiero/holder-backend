export class TransactionTagEntity {
    private id: number;
    private title: string;

    constructor(params: any) {
        this.id = params.id;
        this.title = params.title;
    }

    public toJSON() {
        return {
            id: this.id,
            title:this.title
        }
    }
}