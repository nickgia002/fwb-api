import { Injectable } from '@nestjs/common';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prismaService: PrismaServiceMysql) {}

  getNews() {
    const now = new Date();
    return this.prismaService.news.findMany({
      where: {
        publicationStartDate: {
          lt: now,
        },
        publicationEndDate: {
          gt: now,
        },
      },
      select: {
        publicationStartDate: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
