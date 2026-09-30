import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const labels: Record<string, string> = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  contactado: "Contactado",
  cerrado: "Cerrado",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authorization = request.headers.get("Authorization") ?? "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "No autorizado" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Sesión inválida" }, 401);

    const { data: role } = await admin
      .from("user_roles")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) return json({ error: "Se requiere rol administrador" }, 403);

    const { requestId, status } = await request.json();
    if (typeof requestId !== "string" || !labels[status]) {
      return json({ error: "Solicitud o estado inválido" }, 400);
    }

    const { data: admission, error: readError } = await admin
      .from("admission_requests")
      .select("id,student_name,desired_level,guardian_name,guardian_email,status")
      .eq("id", requestId)
      .single();
    if (readError) return json({ error: readError.message }, 404);

    const { error: updateError } = await admin
      .from("admission_requests")
      .update({ status })
      .eq("id", requestId);
    if (updateError) return json({ error: updateError.message }, 400);

    if (admission.status === status) {
      return json({ updated: true, emailSent: false, warning: "El estado no cambió; no se envió otro correo." });
    }

    const webhookUrl = Deno.env.get("ADMISSION_NOTIFICATION_WEBHOOK_URL");
    const webhookSecret = Deno.env.get("ADMISSION_NOTIFICATION_SECRET");
    if (!webhookUrl || !webhookSecret) {
      return json({
        updated: true,
        emailSent: false,
        warning: "Configurá ADMISSION_NOTIFICATION_WEBHOOK_URL y ADMISSION_NOTIFICATION_SECRET en Supabase.",
      });
    }

    const emailResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admission-secret": webhookSecret,
      },
      body: JSON.stringify({
        requestId: admission.id,
        to: admission.guardian_email,
        guardianName: admission.guardian_name,
        studentName: admission.student_name,
        desiredLevel: admission.desired_level,
        status,
        statusLabel: labels[status],
        subject: `Actualización de solicitud de ingreso · ${admission.student_name}`,
        html: emailHtml(admission.guardian_name, admission.student_name, admission.desired_level, labels[status]),
      }),
    });
    if (!emailResponse.ok) {
      const detail = await emailResponse.text();
      console.error("n8n notification error", detail);
      return json({ updated: true, emailSent: false, warning: "Estado actualizado, pero n8n no pudo enviar el correo." });
    }

    return json({ updated: true, emailSent: true });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Error inesperado" }, 500);
  }
});

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function emailHtml(guardian: string, student: string, level: string, status: string) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.6">
    <div style="max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
      <div style="background:#1d4ed8;color:white;padding:24px"><h1 style="margin:0;font-size:22px">CEAC · Admisiones</h1></div>
      <div style="padding:24px"><p>Hola ${escapeHtml(guardian)},</p>
      <p>La solicitud de ingreso de <strong>${escapeHtml(student)}</strong> para <strong>${escapeHtml(level)}</strong> fue actualizada.</p>
      <p style="font-size:18px">Estado actual: <strong>${escapeHtml(status)}</strong></p>
      <p>Si necesitás más información, comunicate con administración al +506 2551-0300.</p>
      <p>Centro Educativo Adventista de Cartago</p></div>
    </div></body></html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}
