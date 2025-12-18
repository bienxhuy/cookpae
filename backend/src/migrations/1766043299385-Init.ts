import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766043299385 implements MigrationInterface {
    name = 'Init1766043299385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "isActive"`);
    }

}
