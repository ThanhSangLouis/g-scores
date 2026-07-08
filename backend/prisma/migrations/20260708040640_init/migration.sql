-- CreateTable
CREATE TABLE "exam_scores" (
    "id" BIGSERIAL NOT NULL,
    "sbd" VARCHAR(8) NOT NULL,
    "toan" DECIMAL(4,2),
    "ngu_van" DECIMAL(4,2),
    "ngoai_ngu" DECIMAL(4,2),
    "vat_li" DECIMAL(4,2),
    "hoa_hoc" DECIMAL(4,2),
    "sinh_hoc" DECIMAL(4,2),
    "lich_su" DECIMAL(4,2),
    "dia_li" DECIMAL(4,2),
    "gdcd" DECIMAL(4,2),
    "ma_ngoai_ngu" VARCHAR(8),
    "group_a_total" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exam_scores_sbd_key" ON "exam_scores"("sbd");

-- CreateIndex
CREATE INDEX "idx_exam_scores_group_a_total" ON "exam_scores"("group_a_total" DESC);
