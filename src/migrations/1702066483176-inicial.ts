import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1702066483176 implements MigrationInterface {
    name = 'Inicial1702066483176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TeamMember" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" text NOT NULL, "email" text NOT NULL, "userId" uuid, "role" text NOT NULL, CONSTRAINT "PK_794dfbdd914d2e309262dccd292" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" text NOT NULL, CONSTRAINT "PK_8554c501e90dd529b09923447ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" text NOT NULL, "fecha" text NOT NULL, "idUser" text NOT NULL, "encargado" text NOT NULL, "estado" text NOT NULL DEFAULT 'propuesto', "proyectoId" uuid, CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "idOwner" text NOT NULL, CONSTRAINT "PK_589bf061fd654da7076e68e1699" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_proyectos_proyecto" ("teamId" uuid NOT NULL, "proyectoId" uuid NOT NULL, CONSTRAINT "PK_13846a337abf71d886be27ac53e" PRIMARY KEY ("teamId", "proyectoId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f8fd751ecd56bedff03b8eaae3" ON "team_proyectos_proyecto" ("teamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_328060e9c71ec2e39f1d7ffd78" ON "team_proyectos_proyecto" ("proyectoId") `);
        await queryRunner.query(`CREATE TABLE "team_members_team_member" ("teamId" uuid NOT NULL, "teamMemberId" uuid NOT NULL, CONSTRAINT "PK_033130eb5bbb6c7f55bf52e3746" PRIMARY KEY ("teamId", "teamMemberId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_58abee9f8f4aca8f5a9075f1da" ON "team_members_team_member" ("teamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94b920fd4296cf4408ea21c6bd" ON "team_members_team_member" ("teamMemberId") `);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD CONSTRAINT "FK_eadc3ba2543fa9b979d0c0d9f17" FOREIGN KEY ("proyectoId") REFERENCES "proyecto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_proyectos_proyecto" ADD CONSTRAINT "FK_f8fd751ecd56bedff03b8eaae3c" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_proyectos_proyecto" ADD CONSTRAINT "FK_328060e9c71ec2e39f1d7ffd78b" FOREIGN KEY ("proyectoId") REFERENCES "proyecto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_members_team_member" ADD CONSTRAINT "FK_58abee9f8f4aca8f5a9075f1dac" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_members_team_member" ADD CONSTRAINT "FK_94b920fd4296cf4408ea21c6bdf" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_members_team_member" DROP CONSTRAINT "FK_94b920fd4296cf4408ea21c6bdf"`);
        await queryRunner.query(`ALTER TABLE "team_members_team_member" DROP CONSTRAINT "FK_58abee9f8f4aca8f5a9075f1dac"`);
        await queryRunner.query(`ALTER TABLE "team_proyectos_proyecto" DROP CONSTRAINT "FK_328060e9c71ec2e39f1d7ffd78b"`);
        await queryRunner.query(`ALTER TABLE "team_proyectos_proyecto" DROP CONSTRAINT "FK_f8fd751ecd56bedff03b8eaae3c"`);
        await queryRunner.query(`ALTER TABLE "Tasks" DROP CONSTRAINT "FK_eadc3ba2543fa9b979d0c0d9f17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94b920fd4296cf4408ea21c6bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58abee9f8f4aca8f5a9075f1da"`);
        await queryRunner.query(`DROP TABLE "team_members_team_member"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_328060e9c71ec2e39f1d7ffd78"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f8fd751ecd56bedff03b8eaae3"`);
        await queryRunner.query(`DROP TABLE "team_proyectos_proyecto"`);
        await queryRunner.query(`DROP TABLE "proyecto"`);
        await queryRunner.query(`DROP TABLE "Tasks"`);
        await queryRunner.query(`DROP TABLE "Team"`);
        await queryRunner.query(`DROP TABLE "TeamMember"`);
    }

}
