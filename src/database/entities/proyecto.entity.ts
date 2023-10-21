import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Worker } from "./workers.entity"
import { Tasks } from "./tasks.entity"

@Entity({
    name: 'proyecto'
})
export class Proyecto {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    idOwner: string;

    @OneToMany(() => Worker, (worker) => worker.proyecto)
    workers: Worker[];

    @OneToMany(() => Tasks, (tasks) => tasks.proyecto)
    tasks: Tasks[];
}