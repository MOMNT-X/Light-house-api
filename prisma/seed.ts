import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AvailabilityState } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('Clearing existing data...');
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.paymentAttempt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.vendorHours.deleteMany();
  await prisma.vendor.deleteMany();

  console.log('Loading seed data...');
  const dataPath = path.join(__dirname, 'seed-data.json');
  const vendorsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Seeding ${vendorsData.length} vendors...`);

  for (const vData of vendorsData) {
    const { categories, ...vendorInfo } = vData;
    
    await prisma.vendor.create({
      data: {
        ...vendorInfo,
        menuCategories: {
          create: categories.map((cat: any) => ({
            name: cat.name,
            sortOrder: cat.sortOrder,
            items: {
              create: cat.items.map((item: any) => ({
                name: item.name,
                description: item.description || '',
                price: item.price,
                imageUrl: item.imageUrl,
                availability: AvailabilityState.AVAILABLE
              }))
            }
          }))
        }
      }
    });
  }

  console.log('Seeding complete! Vendors and full menus successfully rebuilt.');
  await app.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
