import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesInDB1747358534729 implements MigrationInterface {
    name = 'AddTablesInDB1747358534729'

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
