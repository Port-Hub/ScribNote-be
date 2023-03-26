-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameSlug" VARCHAR(255) NOT NULL,
    "docUrl" VARCHAR(255) NOT NULL,
    "audioUrl" VARCHAR(255) NOT NULL,
    "accessCount" INTEGER DEFAULT 0,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notes_name_key" ON "notes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "notes_nameSlug_key" ON "notes"("nameSlug");

-- CreateIndex
CREATE UNIQUE INDEX "notes_docUrl_key" ON "notes"("docUrl");

-- CreateIndex
CREATE UNIQUE INDEX "notes_audioUrl_key" ON "notes"("audioUrl");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
