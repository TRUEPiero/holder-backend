import { UpdateData } from "../types";

export class ProjectEntity {
    public id: number;
    private title: string;
    private settings: Record<string, any>[];
    private ownerId: number;
    private members: any[];
    private cashboxes: any[];
    
    constructor(params: any) {
        this.id = params.id;
        this.title = params.title;
        this.settings = params.settings;
        this.ownerId = params.ownerId;
        this.members = params.members;
        this.cashboxes = params.cashboxes;
    }
    
    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            settings: this.settings,
            ownerId: this.ownerId,
            members: this.formatMembers(this.members),
            cashboxes: this.cashboxes,
        }
    }

    public getSettings() {
        if(typeof this.settings === 'string') return JSON.parse(this.settings);
        
        return this.settings;
    }

    public update(data: UpdateData) {
        const {settings, ...dataWithoutParams} = data;
        
        for(const [key, value] of Object.entries(dataWithoutParams)) {
            if(value.toString()) (this as any)[key] = value
        }

        this.setParameters(settings);

        return {
            title: this.title,
            ownerId: this.ownerId,
            settings: this.settings,
        };
    }
    
    public checkAccess(user: any) {
        const userId = this.resolveUserId(user);

        if(this.ownerId === userId) return true

        const editors = this.members.filter(member => member.role === 'editor')
                                    .map(member => member.user)
        
        const inEditors = editors.some(i => i.id === userId)
        
        return inEditors;
    }

    private setParameters(newParams: any) {
        const preparedParams = newParams;
        this.settings = preparedParams;
    }

    private formatMembers(members: any[]) {
        if(!members) return [];

        return members.map((member: any) => {
            return {
                ...member.user,
                role: member.role,
                password: undefined
            }
        })
    }

    private resolveUserId(user: any) {
        if (typeof user === "object" && user !== null) {
            return user.id;
        } else {
            return Number(user);
        }
    } 
}