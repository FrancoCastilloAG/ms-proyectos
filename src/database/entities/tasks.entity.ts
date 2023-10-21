import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from "./proyecto.entity"

@Entity({
    name: 'Tasks'
})
export class Tasks {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    nombre: string;

    @Column({ type: 'text' })
    fecha: string;

    @Column({ type: 'text' })
    idUser: string;

    @ManyToOne(() => Proyecto, (proyecto) => proyecto.workers)
    proyecto: Proyecto;
}