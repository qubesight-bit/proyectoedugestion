import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  announcementSchema,
  courseSchema,
  idSchema,
  studentSchema,
  type AppRole,
} from "./validation";

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: roles, error: e1 }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("email, full_name").eq("id", userId).maybeSingle(),
    ]);
    fail(e1);
    return {
      userId,
      email: profile?.email ?? "",
      fullName: profile?.full_name ?? "",
      roles: (roles ?? []).map((r) => r.role as AppRole),
    };
  });

// ---------- Courses ----------
export const listCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });
    fail(error);
    return data ?? [];
  });

export const saveCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    courseSchema.extend({ id: idSchema.shape.id.optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    if (id) {
      const { error } = await context.supabase.from("courses").update(fields).eq("id", id);
      fail(error);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("courses")
      .insert({ ...fields, created_by: context.userId })
      .select("id")
      .single();
    fail(error);
    const { notifyN8n } = await import("./n8n.server");
    await notifyN8n("course.created", { id: row!.id, ...fields });
    return { id: row!.id };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("courses").delete().eq("id", data.id);
    fail(error);
    return { ok: true };
  });

// ---------- Students ----------
export const listStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: true });
    fail(error);
    return data ?? [];
  });

export const saveStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    studentSchema.extend({ id: idSchema.shape.id.optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    if (id) {
      const { error } = await context.supabase.from("students").update(fields).eq("id", id);
      fail(error);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("students")
      .insert({ ...fields, created_by: context.userId })
      .select("id, code")
      .single();
    fail(error);
    const { notifyN8n } = await import("./n8n.server");
    await notifyN8n("student.created", { id: row!.id, code: row!.code, ...fields });
    return { id: row!.id };
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("students").delete().eq("id", data.id);
    fail(error);
    return { ok: true };
  });

// ---------- Announcements ----------
export const listAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    fail(error);
    return data ?? [];
  });

export const saveAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    announcementSchema.extend({ id: idSchema.shape.id.optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    if (id) {
      const { error } = await context.supabase.from("announcements").update(fields).eq("id", id);
      fail(error);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("announcements")
      .insert({ ...fields, created_by: context.userId })
      .select("id")
      .single();
    fail(error);
    const { notifyN8n } = await import("./n8n.server");
    await notifyN8n("announcement.created", { id: row!.id, ...fields });
    return { id: row!.id };
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("announcements").delete().eq("id", data.id);
    fail(error);
    return { ok: true };
  });
