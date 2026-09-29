import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/internal-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleInternalChat } = await import("@/lib/internal-chat.server");
        return handleInternalChat(request);
      },
    },
  },
});
