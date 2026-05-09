import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/context/prisma.service";
import { Temporal } from "@js-temporal/polyfill";
@Injectable()
export class RefreshSessionActivityUseCase {

    constructor(private readonly prisma: PrismaService) { }

    async refreshSessionActivity(sessionId: string) {
        const newExpiration = Temporal.Now.instant().add({ minutes: 10 }).toString();

        await this.prisma.session.update({
            where: { id: sessionId },
            data: { expiresAt: newExpiration },
        });

        return { status: 'Alive', expiresAt: newExpiration };
    }
}