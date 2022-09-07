import { PropertyType } from '.prisma/client';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { userInfo } from 'os';
import { PrismaService } from '../prisma/prisma.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

const mockUser = {
  id: 54,
  name: 'Laith',
  email: 'laith@laith.com',
  phone: '555 555 5555',
};

const mockHome = {
  id: 1,
  address: '2345 William Str',
  city: 'Toronto',
  price: 1500000,
  propertyType: 'RESIDENTIAL',
  image: 'img1',
  numberOfBedrooms: 3,
  numberOfBathrooms: 2.5,
};

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should contruct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Toronto', '1500000');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Toronto',
        price: {
          gte: 1500000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      name: 'Laith',
      id: 30,
      iat: 1,
      exp: 2,
    };

    const mockCreateHomeParam = {
      address: '111 Yellow Str',
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: 'Vancouver',
      landSize: 444,
      price: 3000000,
      propertyType: PropertyType.RESIDENTIAL,
    };
    it("should throw unauth error if realtor didn't create home", async () => {
      await expect(
        controller.updateHome(5, mockCreateHomeParam, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should update home if realtor id is valid', async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockUpdateHome);

      await controller.updateHome(5, mockCreateHomeParam, {
        ...mockUserInfo,
        id: 54,
      });

      expect(mockUpdateHome).toBeCalled();
    });
  });
});
