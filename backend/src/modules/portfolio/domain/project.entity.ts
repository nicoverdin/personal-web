export class Project {
    id: string;
    title: string;
    description: string;
    url?: string | null;
    image?: string | null;
    repoUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Project>) {
        Object.assign(this, partial);
    }
}