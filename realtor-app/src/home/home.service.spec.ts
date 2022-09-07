import { PropertyType } from '.prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { HomeService } from './home.service';

const mockGetHomes = [
  {
    id: 1,
    address: '2345 William Str',
    city: 'Toronto',
    price: 1500000,
    propertyType: 'RESIDENTIAL',
    image: 'img1',
    numberOfBedrooms: 3,
    numberOfBathrooms: 2.5,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

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

const mockImages = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
  },
];

const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
};

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: () => {
                //
              },
              create: () => mockHome,
            },
            image: {
              createMany: () => {
                //
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };
    it('should call prisma home.findMany with correct parameters', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(prismaService.home.findMany).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('it should throw not found exception if no homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createHome', () => {
    const mockCreateHomeParam = {
      address: '111 Yellow Str',
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: 'Vancouver',
      landSize: 444,
      price: 3000000,
      propertyType: PropertyType.RESIDENTIAL,
      images: [
        {
          url: 'src1',
        },
      ],
    };
    it('should call prisma.home.create with the correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParam, 5);

      expect(prismaService.home.create).toBeCalledWith({
        data: {
          address: '111 Yellow Str',
          number_of_bathrooms: 2,
          number_of_bedrooms: 2,
          city: 'Vancouver',
          land_size: 444,
          price: 3000000,
          propertyType: PropertyType.RESIDENTIAL,
          realtor_id: 5,
        },
      });
    });

    it('should call prisma image.createMany with the correct payload', async () => {
      //
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImage);

      await service.createHome(mockCreateHomeParam, 5);

      expect(prismaService.image.createMany).toBeCalledWith({
        data: [
          {
            url: 'src1',
            home_id: 1,
          },
        ],
      });
    });
  });
});
