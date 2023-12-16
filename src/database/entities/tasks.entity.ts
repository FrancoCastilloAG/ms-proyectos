import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { Proyecto } from "./proyecto.entity";

@Entity({
    name: 'Tasks'
})
export class Tasks {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    nombre!: string;

    @Column({ type: 'text' })
    idUser!: string;

    @Column({ type: 'text', nullable: true })
    encargado!: string | null;

    @Column({ type: 'text', default: 'Propuesto' })
    estado!: string;

    @Column({ type: 'text', nullable: true })
    desc!: string | null;

    @Column({ type: 'text', default: () => `to_char(CURRENT_TIMESTAMP, 'YYYY-MM-DD')` })
    fecha!: string;

    @ManyToOne(() => Proyecto, (proyecto) => proyecto.tasks)
    proyecto!: Proyecto;
}
