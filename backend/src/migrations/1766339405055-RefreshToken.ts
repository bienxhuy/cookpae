import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshToken1766339405055 implements MigrationInterface {
    name = 'RefreshToken1766339405055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "last_used_at" TIMESTAMP, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f0812282fad2e352cdaf83ef0a" ON "refresh_token" ("token_hash") `);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0812282fad2e352cdaf83ef0a"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
