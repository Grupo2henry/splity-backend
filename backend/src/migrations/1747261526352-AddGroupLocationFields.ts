import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupLocationFields1747261526352 implements MigrationInterface {
    name = 'AddGroupLocationFields1747261526352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."group_membership_role_enum" AS ENUM('guest', 'member', 'group_admin')`);
        await queryRunner.query(`CREATE TABLE "group_membership" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "joined_at" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "role" "public"."group_membership_role_enum" NOT NULL DEFAULT 'member', "userId" uuid, "groupId" integer, CONSTRAINT "PK_b631623cf04fa74513b975e7059" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL, "emoji" character varying, "locationName" character varying, "latitude" double precision, "longitude" double precision, "createdById" uuid, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_split" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "amount_owed" numeric(10,2) NOT NULL, "expenseId" integer, "userId" uuid, CONSTRAINT "PK_d4387724d7e9c15eb02415ecc0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "amount" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "imgUrl" character varying, "groupId" integer, "paidById" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "status" character varying NOT NULL, "transaction_id" character varying, "payment_date" TIMESTAMP NOT NULL, "active" boolean NOT NULL DEFAULT true, "userId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "started_at" TIMESTAMP NOT NULL, "ends_at" TIMESTAMP NOT NULL, "userId" uuid, "paymentId" integer, CONSTRAINT "REL_166c9f050dd956fcb00e9a8276" UNIQUE ("paymentId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying(96), "google_id" character varying, "profile_picture_url" character varying, "is_premium" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'user', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "total_groups_created" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "liquidations" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "status" character varying NOT NULL, "transaction_id" character varying, "paid_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "userId" uuid, CONSTRAINT "PK_2beac231b5ead3f70f2f6347a08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_membership" ADD CONSTRAINT "FK_d59b6ccf0c6407b3fb9b7d321ec" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_membership" ADD CONSTRAINT "FK_b1411f07fafcd5ad93c6ee16424" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_split" ADD CONSTRAINT "FK_6c4307f45611899a6c75d096964" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_split" ADD CONSTRAINT "FK_80d575d5e7bbf5e912de4fe83a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_3e5276c441c4db9113773113136" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_11747f69e8441abcbaabd7c259f" FOREIGN KEY ("paidById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_166c9f050dd956fcb00e9a8276c" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liquidations" ADD CONSTRAINT "FK_0dc5d399cf658d77fcfa637be7c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "liquidations" DROP CONSTRAINT "FK_0dc5d399cf658d77fcfa637be7c"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_166c9f050dd956fcb00e9a8276c"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_11747f69e8441abcbaabd7c259f"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_3e5276c441c4db9113773113136"`);
        await queryRunner.query(`ALTER TABLE "expense_split" DROP CONSTRAINT "FK_80d575d5e7bbf5e912de4fe83a6"`);
        await queryRunner.query(`ALTER TABLE "expense_split" DROP CONSTRAINT "FK_6c4307f45611899a6c75d096964"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36"`);
        await queryRunner.query(`ALTER TABLE "group_membership" DROP CONSTRAINT "FK_b1411f07fafcd5ad93c6ee16424"`);
        await queryRunner.query(`ALTER TABLE "group_membership" DROP CONSTRAINT "FK_d59b6ccf0c6407b3fb9b7d321ec"`);
        await queryRunner.query(`DROP TABLE "liquidations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP TABLE "expense_split"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "group_membership"`);
        await queryRunner.query(`DROP TYPE "public"."group_membership_role_enum"`);
    }

}
