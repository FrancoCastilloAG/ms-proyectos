import { MigrationInterface, QueryRunner } from "typeorm";

export class Taskedit21697825243021 implements MigrationInterface {
    name = 'Taskedit21697825243021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
