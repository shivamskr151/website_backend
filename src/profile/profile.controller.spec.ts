import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getUserProfile: jest.fn(),
            updateUserProfile: jest.fn(),
            deleteUserProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = '1';
      const expectedResult = { id: '1', email: 'test@example.com' };
      jest.spyOn(service, 'getUserProfile').mockResolvedValue(expectedResult);

      const result = await controller.getProfile(userId);
      expect(result).toEqual(expectedResult);
      expect(service.getUserProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = '1';
      const updateUserDto = { firstName: 'John', lastName: 'Doe' };
      const expectedResult = { id: '1', firstName: 'John', lastName: 'Doe' };
      jest.spyOn(service, 'updateUserProfile').mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(userId, updateUserDto);
      expect(result).toEqual(expectedResult);
      expect(service.updateUserProfile).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });
});
