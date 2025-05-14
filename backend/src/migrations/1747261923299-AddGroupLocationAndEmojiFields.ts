import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupLocationAndEmojiFields1747261923299 implements MigrationInterface {
    name = 'AddGroupLocationAndEmojiFields1747261923299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "emoji" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "emoji"`);
    }

}
