import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from "./proyecto.entity"

@Entity({
    name: 'Worker'
})
export class Worker {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    Rol: string;

    @ManyToOne(() => Proyecto, (proyecto) => proyecto.workers)
    proyecto: Proyecto;
}