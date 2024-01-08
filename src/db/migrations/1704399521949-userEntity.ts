import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntity1704399521949 implements MigrationInterface {
    name = 'UserEntity1704399521949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    }

}
