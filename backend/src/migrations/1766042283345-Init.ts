import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766042283345 implements MigrationInterface {
    name = 'Init1766042283345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "isActive"`);
    }

}
