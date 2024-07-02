-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activationKey" TEXT NOT NULL,
    "full_name" TEXT,
    "image_path" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "made" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitors" (
    "id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referer" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "referer" TEXT NOT NULL,
    "visitorsId" TEXT,

    CONSTRAINT "Referer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_activationKey_key" ON "Users"("activationKey");

-- AddForeignKey
ALTER TABLE "Referer" ADD CONSTRAINT "Referer_visitorsId_fkey" FOREIGN KEY ("visitorsId") REFERENCES "Visitors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
