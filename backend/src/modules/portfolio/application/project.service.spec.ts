import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './create-project.dto';

const mockProjectRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: 'ProjectRepository',
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should call the repository and return the new project', async () => {
      const dto: CreateProjectDto = {
        title: 'Test Project',
        description: 'Testing is fun',
        url: 'http://test.com',
      };
      
      const expectedResult = { id: 'uuid-123', ...dto, createdAt: new Date() };
      mockProjectRepository.create.mockResolvedValue(expectedResult);

      const result = await service.createProject(dto);

      expect(mockProjectRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Project'
      }));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllProjects', () => {
    it('should return an array of projects', async () => {
      const expectedProjects = [
        { title: 'P1' }, { title: 'P2' }
      ];
      mockProjectRepository.findAll.mockResolvedValue(expectedProjects);

      const result = await service.getAllProjects();

      expect(mockProjectRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expectedProjects);
    });
  });
});