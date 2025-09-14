import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ZodError } from "zod";
import { paymentWebhookSchema } from "../utils/schema";

console.log("[MW] paymentSignature v5 (diag) loaded");

export const validatePaymentSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("[MW] hit");
    console.log("=== RAW BODY ===");
    console.log(JSON.stringify(req.body, null, 2));

    const parsed = await paymentWebhookSchema.parseAsync(req.body);
    const { order_id, status_code, gross_amount, signature_key } = parsed;

    // NOTES: buat pastiin serverkey harus sama dengan sandbox Server Key
    let serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
    const beforeTrimLen = serverKey.length;
    const beforeTrimTail = serverKey.charCodeAt(serverKey.length - 1);
    serverKey = serverKey.trim(); // remove stray spaces/CR/LF
    const afterTrimLen = serverKey.length;
    const afterTrimTail = serverKey.charCodeAt(serverKey.length - 1);

    if (!serverKey) {
      console.error("Missing MIDTRANS_SERVER_KEY");
      res.status(500).json({ message: "Missing MIDTRANS_SERVER_KEY." });
      return;
    }

    // STRICT: gunakan status_code & gross_amount apa adanya
    const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const computed = crypto
      .createHash("sha512")
      .update(raw)
      .digest("hex")
      .toLowerCase();
    const received = (signature_key || "").toLowerCase();
    const valid = computed === received;

    console.log("=== SIG DEBUG ===");
    console.log({ order_id, status_code, gross_amount });
    console.log(
      "serverKey(beforeTrim) len/tailASCII:",
      beforeTrimLen,
      "/",
      beforeTrimTail
    );
    console.log(
      "serverKey(afterTrim)  len/tailASCII:",
      afterTrimLen,
      "/",
      afterTrimTail
    );
    console.log("Hash string:", raw);
    console.log("Computed   :", computed);
    console.log("Received   :", received);
    console.log("VALID?     :", valid);

    // DIAGNOSTIC MODE: untuk sementara, jangan 401 agar tidak spam retry/email.
    // kalo invalid, balas 200 dengan flag dan AKHIRI middleware.
    if (!valid) {
      res.status(200).json({ ok: true, reason: "diag-mode", valid });
      return;
    }

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      console.log("Zod error:", err.issues);
      res.status(400).json({
        message: "Invalid payload.",
        details: err.issues.map((i) => i.message),
      });
      return;
    }
    console.error("Middleware error:", err);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
