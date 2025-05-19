import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1747529004282 implements MigrationInterface {
    name = 'AddTables1747529004282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "emoji" character varying`);
        await queryRunner.query(`ALTER TABLE "group" ADD "locationName" character varying`);
        await queryRunner.query(`ALTER TABLE "group" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "group" ADD "longitude" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "locationName"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "emoji"`);
    }

}
