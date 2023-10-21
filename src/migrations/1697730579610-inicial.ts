import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1697730579610 implements MigrationInterface {
    name = 'Inicial1697730579610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Worker" ("id" uuid NOT NULL, "Rol" text NOT NULL, "proyectoId" uuid, CONSTRAINT "PK_7ca522aa5a63989580081ecbd20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tasks" ("id" uuid NOT NULL, "nombre" text NOT NULL, "fecha" text NOT NULL, "idUser" text NOT NULL, "idProyecto" text NOT NULL, "proyectoId" uuid, CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "idOwner" text NOT NULL, CONSTRAINT "PK_589bf061fd654da7076e68e1699" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Worker" ADD CONSTRAINT "FK_e6201a4aa6c73ffc9015ded6e16" FOREIGN KEY ("proyectoId") REFERENCES "proyecto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD CONSTRAINT "FK_eadc3ba2543fa9b979d0c0d9f17" FOREIGN KEY ("proyectoId") REFERENCES "proyecto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" DROP CONSTRAINT "FK_eadc3ba2543fa9b979d0c0d9f17"`);
        await queryRunner.query(`ALTER TABLE "Worker" DROP CONSTRAINT "FK_e6201a4aa6c73ffc9015ded6e16"`);
        await queryRunner.query(`DROP TABLE "proyecto"`);
        await queryRunner.query(`DROP TABLE "Tasks"`);
        await queryRunner.query(`DROP TABLE "Worker"`);
    }

}
