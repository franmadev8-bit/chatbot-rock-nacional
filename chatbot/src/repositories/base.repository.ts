import { PrismaService } from "../prisma/prisma.service.js";
import { Args, Delegate, ModelName } from "../types/prisma.types.js";

export class BaseRepository<M extends ModelName> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly model: M
    ) { }

    private get delegate(): Delegate<M> {
        const key = (this.model[0].toLowerCase() + this.model.slice(1)) as Uncapitalize<M>;
        return this.prisma[key] as unknown as Delegate<M>;
    }

    getAll(args?: Args<M, 'findMany'>) {
        return this.delegate.findMany(args);
    }
    
    getOne(args: Args<M, 'findUnique'>) {
        return this.delegate.findUnique(args);
    }

    newOne(args: Args<M, 'create'>) {
        return this.delegate.create(args);
    }

    changeOne(args: Args<M, 'update'>) {
        return this.delegate.update(args);
    }

    dropOne(args: Args<M, 'delete'>) {
        return this.delegate.delete(args);
    }
}