import { json, type Ctx } from "../_lib/env";

export const onRequestGet = (ctx: Ctx) => json({ unlocked: Boolean(ctx.data.isAdmin) });