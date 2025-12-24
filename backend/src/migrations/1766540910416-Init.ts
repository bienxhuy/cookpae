import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766540910416 implements MigrationInterface {
    name = 'Init1766540910416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "area" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "area" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "vote" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vote" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vote" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "vote" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "area" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "area" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
