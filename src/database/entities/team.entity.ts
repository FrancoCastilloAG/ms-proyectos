import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany,Column ,JoinTable} from "typeorm";
import { Proyecto } from "./proyecto.entity";
import { TeamMember } from "./teammember.entity";

@Entity({
    name: 'Team'
})
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    nombre!: string;

    @ManyToMany(() => Proyecto, (proyecto) => proyecto.teams)
    @JoinTable()
    proyectos!: Proyecto[];
    

    @ManyToMany(() => TeamMember, (teamMember) => teamMember.teams)
    @JoinTable()
    members!: TeamMember[];
    
}
