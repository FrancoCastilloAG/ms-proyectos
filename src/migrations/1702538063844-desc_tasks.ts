import { MigrationInterface, QueryRunner } from "typeorm";

export class DescTasks1702538063844 implements MigrationInterface {
    name = 'DescTasks1702538063844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ADD "desc" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" DROP COLUMN "desc"`);
    }

}
