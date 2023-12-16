import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Team } from "./team.entity";
import { Tasks } from "./tasks.entity";

@Entity({
    name: 'proyecto'
})
export class Proyecto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text' })
    idOwner!: string;

    @ManyToMany(() => Team, (teams) => teams.proyectos)
    teams!: Team[];

    @ManyToMany(() => Tasks, (tasks) => tasks.proyecto)
    tasks!: Tasks[];
}