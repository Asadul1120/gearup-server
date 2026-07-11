-- DropForeignKey
ALTER TABLE "gear_items" DROP CONSTRAINT "gear_items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "gear_items" DROP CONSTRAINT "gear_items_providerId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_rentalOrderId_fkey";

-- DropForeignKey
ALTER TABLE "rental_orders" DROP CONSTRAINT "rental_orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "rental_orders" DROP CONSTRAINT "rental_orders_gearId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_gearId_fkey";

-- AddForeignKey
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "rental_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_orders" ADD CONSTRAINT "rental_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_orders" ADD CONSTRAINT "rental_orders_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "gear_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "gear_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
