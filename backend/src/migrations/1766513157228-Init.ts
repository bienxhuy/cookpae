import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766513157228 implements MigrationInterface {
    name = 'Init1766513157228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "originalName" character varying, "path" character varying, "uploadedBy" integer NOT NULL, "embedded" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a8213e54fea7d1bcf38d7d3efcf" UNIQUE ("fileName"), CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a8213e54fea7d1bcf38d7d3efc" ON "document" ("fileName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a8213e54fea7d1bcf38d7d3efc"`);
        await queryRunner.query(`DROP TABLE "document"`);
    }

}
