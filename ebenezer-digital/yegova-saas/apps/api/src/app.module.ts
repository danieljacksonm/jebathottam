import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BillsModule } from './bills/bills.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExpensesModule } from './expenses/expenses.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { ShopModule } from './shop/shop.module';
import { StockModule } from './stock/stock.module';
import { TeamModule } from './team/team.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ShopModule,
    ProductsModule,
    CustomersModule,
    BillsModule,
    DashboardModule,
    ReportsModule,
    ExpensesModule,
    StockModule,
    TeamModule,
    BillingModule,
  ],
})
export class AppModule {}
