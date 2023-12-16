import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./team.entity";

@Entity({
    name: 'TeamMember'
})
export class TeamMember {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToMany(() => Team, (team) => team.members)
    teams!: Team[];

    @Column({ type: 'text' })
    nombre!: string;

    @Column({ type: 'text' })
    email!: string;

    @Column({ type: 'uuid', nullable: true })
    userId!: string;

    @Column({ type: 'text' })
    role!: string;
}
