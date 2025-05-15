import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupLocationFields1747261674420 implements MigrationInterface {
    name = 'AddGroupLocationFields1747261674420'

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
