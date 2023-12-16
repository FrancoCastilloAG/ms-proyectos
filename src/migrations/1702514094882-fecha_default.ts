import { MigrationInterface, QueryRunner } from "typeorm";

export class FechaDefault1702514094882 implements MigrationInterface {
    name = 'FechaDefault1702514094882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ALTER COLUMN "estado" SET DEFAULT 'Propuesto'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ALTER COLUMN "estado" SET DEFAULT 'propuesto'`);
    }

}
