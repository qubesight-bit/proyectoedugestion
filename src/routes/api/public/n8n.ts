import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { announcementSchema } from "@/lib/validation";

const bodySchema = z.object({
  action: z.literal("create_announcement"),
  data: announcementSchema,
});

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const Route = createFileRoute("/api/public/n8n")({
  server: {
    handlers: {
      GET: async () => Response.json({ ok: true, service: "ceac-n8n" }),
      POST: async ({ request }) => {
        const secret = process.env["N8N_WEBHOOK_SECRET"];
        const provided = request.headers.get("x-webhook-secret") ?? "";
        if (!secret || !safeEqual(provided, secret)) {
          return new Response("Unauthorized", { status: 401 });
        }
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("announcements")
          .insert({ ...parsed.data.data, source: "n8n" })
          .select("id")
          .single();
        if (error) return Response.json({ error: "No se pudo guardar" }, { status: 500 });
        return Response.json({ ok: true, id: data.id });
      },
    },
  },
});
