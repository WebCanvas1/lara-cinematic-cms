import type { Ctx } from "../_lib/env";
import { handleCollectionGet, handleCollectionPost } from "../_lib/collection";
export const onRequestGet = (ctx: Ctx) => handleCollectionGet(ctx, "team");
export const onRequestPost = (ctx: Ctx) => handleCollectionPost(ctx, "team");
