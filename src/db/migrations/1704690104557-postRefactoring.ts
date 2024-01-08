import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1704690104557 implements MigrationInterface {
    name = 'PostRefactoring1704690104557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupId" uuid, CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subject" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying DEFAULT '', "subjectCode" character varying DEFAULT '', CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "studentProfileId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_fd56f7fb598c0f101a78333fa2f" UNIQUE ("studentProfileId")`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_ce9660fc114efef4062bba4c119" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fd56f7fb598c0f101a78333fa2f" FOREIGN KEY ("studentProfileId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fd56f7fb598c0f101a78333fa2f"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_ce9660fc114efef4062bba4c119"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_fd56f7fb598c0f101a78333fa2f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "studentProfileId"`);
        await queryRunner.query(`DROP TABLE "subject"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
