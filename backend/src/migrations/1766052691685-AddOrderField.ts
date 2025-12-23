import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderField1766052691685 implements MigrationInterface {
    name = 'AddOrderField1766052691685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "order"`);
    }

}
