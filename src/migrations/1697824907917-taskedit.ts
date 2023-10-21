import { MigrationInterface, QueryRunner } from "typeorm";

export class Taskedit1697824907917 implements MigrationInterface {
    name = 'Taskedit1697824907917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" DROP COLUMN "idProyecto"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ADD "idProyecto" text NOT NULL`);
    }

}
