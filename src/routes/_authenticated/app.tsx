import { createFileRoute } from "@tanstack/react-router";
import { AppExperience } from "@/components/app/AppExperience";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Centro Educativo Adventista | Plataforma" }] }),
  component: AppExperience,
});
