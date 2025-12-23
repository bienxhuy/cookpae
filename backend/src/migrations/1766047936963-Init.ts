import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766047936963 implements MigrationInterface {
    name = 'Init1766047936963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachment" ADD "publicId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD CONSTRAINT "UQ_633315e48dd0cc9a160cbb9cd38" UNIQUE ("publicId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachment" DROP CONSTRAINT "UQ_633315e48dd0cc9a160cbb9cd38"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "publicId"`);
    }

}
