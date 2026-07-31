import {
  json,
  error,
  readJson,
  requireAdmin,
  type Ctx,
  type Env,
} from "../_lib/env";
import {
  readCollection,
  writeCollection,
  randomId,
} from "../_lib/kv";
import type { Enquiry } from "../../src/lib/site-types";

export const onRequestGet = async (ctx: Ctx) => {
  const guard = requireAdmin(ctx);

  if (guard) {
    return guard;
  }

  const items = await readCollection<Enquiry[]>(
    ctx.env,
    "enquiries",
  );

  return json(
    [...items]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      )
      .slice(0, 200),
  );
};

export const onRequestPost: PagesFunction<
  Env,
  string,
  { isAdmin?: boolean }
> = async (ctx) => {
  const body = await readJson<Record<string, unknown>>(
    ctx.request,
  );

  // Delete an enquiry from the admin panel
  if (body?.action === "delete") {
    const guard = requireAdmin(ctx as unknown as Ctx);

    if (guard) {
      return guard;
    }

    const id = body.id;

    if (typeof id !== "string") {
      return error(400, "Missing id");
    }

    const items = await readCollection<Enquiry[]>(
      ctx.env,
      "enquiries",
    );

    await writeCollection(
      ctx.env,
      "enquiries",
      items.filter((item) => item.id !== id),
    );

    return json({ ok: true });
  }

  // Read and clean form fields
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const eventDate = String(body.event_date ?? "").trim();
  const venue = String(body.venue ?? "").trim();
  const service = String(body.service ?? "").trim();
  const budget = String(body.budget ?? "").trim();

  // Validate required fields
  if (!name || !email || !message) {
    return error(400, "Missing required fields");
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return error(400, "Invalid email");
  }

  if (
    name.length > 200 ||
    email.length > 255 ||
    message.length > 4000
  ) {
    return error(400, "Field too long");
  }

  const enquiry: Enquiry = {
    id: randomId(),
    name,
    email,
    message,
    phone: phone || null,
    event_date: eventDate || null,
    venue: venue || null,
    service: service || null,
    budget: budget || null,
    created_at: new Date().toISOString(),
  };

  // Save the enquiry in Cloudflare KV
  const items = await readCollection<Enquiry[]>(
    ctx.env,
    "enquiries",
  );

  await writeCollection(
    ctx.env,
    "enquiries",
    [enquiry, ...items].slice(0, 1000),
  );

  // Send the enquiry through Web3Forms
  const accessKey = ctx.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.error(
      "WEB3FORMS_ACCESS_KEY is not configured in Cloudflare.",
    );

    // The enquiry has still been saved successfully
    return json({
      ok: true,
      emailSent: false,
    });
  }

  try {
    const response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Lara Cinematography enquiry from ${name}`,
          from_name: "Lara Cinematography Website",

          name,
          email,
          phone: phone || "Not provided",
          event_date: eventDate || "Not provided",
          venue: venue || "Not provided",
          service: service || "Not provided",
          budget: budget || "Not provided",
          message,

          // Used by Web3Forms as a spam honeypot
          botcheck: "",
        }),
      },
    );

    const result = (await response.json()) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || result.success !== true) {
      console.error(
        "Web3Forms email failed:",
        result.message || response.statusText,
      );

      return json({
        ok: true,
        emailSent: false,
      });
    }

    return json({
      ok: true,
      emailSent: true,
    });
  } catch (err) {
    console.error("Web3Forms request error:", err);

    return json({
      ok: true,
      emailSent: false,
    });
  }
};
