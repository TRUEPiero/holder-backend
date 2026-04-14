import { BotContext } from "../core/context";
import { Step } from "../types";

export class HistoryService {
    constructor(
        private ctx: BotContext
    ) {}

    public getFull() {
        return this.ctx.session.history;
    }

    public setStartStep() {
        this.ctx.session.history = [{type: 'start'}]
    }

    public add(step: Step) {
        const isPaginationStep = this.checkIsPagination(step);
        if(isPaginationStep) return;

        this.checkHistoryLength();
        
        this.ctx.session.history.push(step);
    }

    public getPreviosStep() {
        
        this.ctx.session.history.pop();
        const previosStep = this.ctx.session.history.pop();

        if(!previosStep) return {type: 'start'};

        return previosStep;
    }

    private checkIsPagination(curStep: Step): boolean {
        const history = this.getFull();
        const prevStep = history[history.length - 1];

        if(curStep?.type === 'page' && prevStep?.type === 'page') {
            return true;
        }

        return false
    }

    private checkHistoryLength() {
        const history = this.getFull();
        
        if(history.length === 15) {
            this.ctx.session.history.shift();
        }
    }
}