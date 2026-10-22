-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('COP', 'USD');

-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('FIJO', 'PORCENTAJE_VENTA', 'VALOR_POR_VENTA');

-- AlterTable
ALTER TABLE "ClientSubscription" ADD COLUMN     "billingType" "BillingType" NOT NULL DEFAULT 'FIJO',
ADD COLUMN     "commissionRate" DOUBLE PRECISION,
ADD COLUMN     "conceptName" TEXT,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'COP',
ADD COLUMN     "pendingSalesBasis" INTEGER,
ADD COLUMN     "priceUSD" INTEGER,
ADD COLUMN     "valorPorVenta" INTEGER,
ALTER COLUMN "serviceId" DROP NOT NULL,
ALTER COLUMN "priceCOP" SET DEFAULT 0;
