import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const REWARDS = [
  { id: "sticker", name: "Sticker especial", cost: 20, icon: "auto_awesome" },
  { id: "pencil", name: "Lápiz CEAC", cost: 35, icon: "edit" },
  { id: "badge", name: "Insignia de mérito", cost: 50, icon: "workspace_premium" },
  { id: "privilege", name: "Privilegio de aula", cost: 80, icon: "celebration" },
];

const MOODS = [
  { key: "feliz", label: "¡Estoy feliz!", face: "😊" },
  { key: "motivado", label: "¡Vamos!", face: "😄" },
  { key: "curioso", label: "Tengo curiosidad", face: "🤓" },
  { key: "tranquilo", label: "Todo bien", face: "🙂" },
];

export function StudentGamification({ studentId, studentName }: { studentId: string; studentName: string }) {
  const qc = useQueryClient();

  const gamification = useQuery({
    queryKey: ["student_gamification", studentId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("student_gamification")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const interact = useMutation({
    mutationFn: async (mood: string) => {
      const { data, error } = await (supabase as any).rpc("student_avatar_interact", {
        p_student_id: studentId,
        p_mood: mood,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["student_gamification", studentId] });
      toast.success("¡Lumi se alegró de verte!");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const redeem = useMutation({
    mutationFn: async ({ name, cost }: { name: string; cost: number }) => {
      const { data, error } = await (supabase as any).rpc("redeem_student_reward", {
        p_student_id: studentId,
        p_cost: cost,
      });
      if (error) throw error;
      return { name, balance: data };
    },
    onSuccess: async ({ name }) => {
      await qc.invalidateQueries({ queryKey: ["student_gamification", studentId] });
      toast.success(`Canjeaste: ${name}. Mostrá este mensaje a tu docente.`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const coins = gamification.data?.coins ?? 0;
  const streak = gamification.data?.streak ?? 0;
  const mood = gamification.data?.mood ?? "feliz";
  const currentMood = MOODS.find((item) => item.key === mood) ?? MOODS[0];

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18a9e2]">Mi mundo CEAC</p>
        <h1 className="text-2xl font-bold text-[#315b69]">Monedas, premios y Lumi</h1>
        <p className="mt-1 text-sm text-[#748890]">Tus buenas acciones y logros pueden convertirse en recompensas.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <article className="overflow-hidden rounded-[28px] border border-[#dce7ea] bg-white shadow-[0_12px_30px_rgba(49,91,105,0.07)]">
          <div className="grid gap-5 p-5 sm:grid-cols-[180px_1fr] sm:p-7">
            <div className="flex min-h-44 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#e7f4f7] via-[#f7fbfc] to-[#fff5d8]">
              <div className="text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[38%_62%_55%_45%/45%_40%_60%_55%] bg-[#567b88] text-6xl shadow-lg ring-8 ring-white/70" aria-label={`Lumi está ${currentMood.label.toLowerCase()}`}>
                  {currentMood.face}
                </div>
                <p className="mt-3 text-sm font-bold text-[#315b69]">Lumi</p>
              </div>
            </div>

            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff5d8] px-3 py-1 text-sm font-bold text-[#8a6500]">
                <span className="material-symbols-outlined text-[18px]">monetization_on</span>
                {coins} Monedas CEAC
              </span>
              <h2 className="mt-4 text-xl font-bold text-[#243746]">¡Hola, {studentName.split(" ")[0]}!</h2>
              <p className="mt-2 text-sm leading-6 text-[#748890]">
                Lumi te acompaña en tu progreso. Tocá una emoción para interactuar con él y mantener tu racha.
              </p>

              <div className="mt-4 rounded-2xl bg-[#f3f7f8] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#64779a]">Racha de interacción</p>
                <p className="mt-1 text-2xl font-bold text-[#315b69]">{streak} {streak === 1 ? "día" : "días"} 🔥</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {MOODS.map((item) => (
                  <Button
                    key={item.key}
                    type="button"
                    variant="outline"
                    className="h-auto min-h-12 justify-start rounded-2xl border-[#d8e4e8] bg-white px-3 py-2 text-left text-[#486d79]"
                    disabled={interact.isPending}
                    onClick={() => interact.mutate(item.key)}
                  >
                    <span className="text-xl">{item.face}</span>
                    <span className="whitespace-normal text-xs">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </article>

        <aside className="rounded-[28px] border border-[#f0dfb9] bg-[#fffaf0] p-5 sm:p-7">
          <span className="material-symbols-outlined rounded-2xl bg-[#f4b51f] p-2 text-[#243746]">lightbulb</span>
          <h2 className="mt-4 text-lg font-bold text-[#315b69]">¿Cómo gano monedas?</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-[#6f8087]">
            <li>⭐ Buen desempeño y esfuerzo.</li>
            <li>🤝 Ayudar y respetar a otros.</li>
            <li>📚 Cumplir tareas y metas.</li>
            <li>🌱 Participar en actividades y valores.</li>
          </ul>
          <p className="mt-4 text-xs text-[#8b989d]">Los docentes y administradores son quienes otorgan las monedas.</p>
        </aside>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#315b69]">Tienda de premios</h2>
            <p className="text-sm text-[#748890]">Canjeá tus monedas por recompensas definidas por el centro educativo.</p>
          </div>
          <span className="text-sm font-semibold text-[#8a6500]">Saldo: {coins}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {REWARDS.map((reward) => (
            <article key={reward.id} className="rounded-2xl border border-[#dce7ea] bg-white p-4 shadow-sm">
              <span className="material-symbols-outlined rounded-xl bg-[#e7f4f7] p-2 text-[#315b69]">{reward.icon}</span>
              <h3 className="mt-3 font-bold text-[#243746]">{reward.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#b47e00]">{reward.cost} monedas</p>
              <Button
                type="button"
                className="mt-4 w-full rounded-xl bg-[#315b69] text-white hover:bg-[#294e5a]"
                disabled={redeem.isPending || coins < reward.cost}
                onClick={() => redeem.mutate({ name: reward.name, cost: reward.cost })}
              >
                {coins < reward.cost ? "Faltan monedas" : "Canjear"}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
