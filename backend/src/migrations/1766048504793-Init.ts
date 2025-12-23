import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766048504793 implements MigrationInterface {
    name = 'Init1766048504793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP COLUMN "order"`);
    }

}
