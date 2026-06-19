import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paystack-verify")({
  // @ts-expect-error – TanStack Start adds `server.handlers` at runtime; types lag behind
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { reference, expectedAmount, expectedCurrency } =
            (await request.json()) as {
              reference?: string;
              expectedAmount?: number;
              expectedCurrency?: string;
            };

          if (!reference || typeof reference !== "string") {
            return Response.json(
              { ok: false, error: "Missing reference" },
              { status: 400 },
            );
          }

          const secret = process.env.PAYSTACK_SECRET_KEY;
          if (!secret) {
            return Response.json(
              { ok: false, error: "Server not configured" },
              { status: 500 },
            );
          }

          const res = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            { headers: { Authorization: `Bearer ${secret}` } },
          );
          const json = (await res.json()) as {
            status?: boolean;
            data?: {
              status?: string;
              amount?: number;
              currency?: string;
              reference?: string;
            };
            message?: string;
          };

          if (!res.ok || !json.status || json.data?.status !== "success") {
            return Response.json(
              { ok: false, error: json.message ?? "Verification failed" },
              { status: 400 },
            );
          }

          if (
            typeof expectedAmount === "number" &&
            json.data?.amount !== expectedAmount
          ) {
            return Response.json(
              { ok: false, error: "Amount mismatch" },
              { status: 400 },
            );
          }
          if (
            expectedCurrency &&
            json.data?.currency &&
            json.data.currency !== expectedCurrency
          ) {
            return Response.json(
              { ok: false, error: "Currency mismatch" },
              { status: 400 },
            );
          }

          return Response.json({
            ok: true,
            reference: json.data?.reference,
            amount: json.data?.amount,
            currency: json.data?.currency,
          });
        } catch (e) {
          return Response.json(
            { ok: false, error: (e as Error).message },
            { status: 500 },
          );
        }
      },
    },
  },
});
