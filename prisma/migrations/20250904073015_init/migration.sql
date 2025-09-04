-- CreateTable
CREATE TABLE "public"."records" (
    "id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "order_date" DATE NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "delivery" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "remain" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "capital" DOUBLE PRECISION NOT NULL,
    "kilo" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "profit_total" DOUBLE PRECISION NOT NULL,
    "capital_total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);
