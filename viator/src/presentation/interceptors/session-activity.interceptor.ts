/* import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs";
import { Temporal } from "@js-temporal/polyfill";
import { PrismaService } from "src/infrastructure/prisma/context/prisma.service";

@Injectable()
export class SessionActivityInterceptor implements NestInterceptor {
    private readonly logger = new Logger(SessionActivityInterceptor.name);

    constructor(private readonly prisma: PrismaService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const sessionId = request.user?.sessionId;

        return next.handle().pipe(
            tap(async () => {
                if (sessionId) {
                    try {
                        const newExpiration = Temporal.Now.instant().add({ minutes: 10 }).toString();

                        await this.prisma.session.update({
                            where: { id: sessionId },
                            data: { expiresAt: newExpiration },
                        });
                    } catch (error) {
                        this.logger.error(`No se pudo actualizar la actividad de la sesion ${sessionId}: `, error);
                    }
                }
            }),
        );
    }
} */

