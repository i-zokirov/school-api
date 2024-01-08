import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1704690541479 implements MigrationInterface {
    name = 'PostRefactoring1704690541479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "group" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "group" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "student" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "updatedAt"`);
    }

}
