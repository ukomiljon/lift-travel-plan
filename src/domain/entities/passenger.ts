import { IVisitor } from "./interfaces/iVisitor";



export class Passenger implements IVisitor {

    id: number
    health: string
    age: number
    family_id: number
    constructor(payload: Partial<Passenger>) {
        this.id = payload.id || 0
        this.health = payload.health || ''
        this.age = payload.age || 0
        this.family_id = payload.family_id || 0
    }
}







