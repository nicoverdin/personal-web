export class Project {
    id: string;
    title: string;
    description: string;
    url?: string;
    image?: string;
    repoUrl?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Project>) {
        Object.assign(this, partial);
    }
}