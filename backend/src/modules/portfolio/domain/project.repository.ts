import { Project } from "./project.entity";

export interface ProjectRepository {
    create(project: Project): Promise<Project>;
    findAll(): Promise<Project[]>
    findById(id: String): Promise<Project | null>
}