import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import { CreateRegistrationBody, GetRegistrationParams } from "@workspace/api-zod";

const router: IRouter = Router();

/* POST /registrations — create new */
router.post("/registrations", async (req, res): Promise<void> => {
  const parsed = CreateRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid registration body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { data, error } = await supabase
    .from("registrations")
    .insert({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      emirates_id: parsed.data.emiratesId,
      brand: parsed.data.brand,
      card_type: parsed.data.cardType,
      region: parsed.data.region,
      street_address: parsed.data.streetAddress,
      neighborhood: parsed.data.neighborhood,
      delivery_date: parsed.data.deliveryDate,
      payment_method: parsed.data.paymentMethod,
    })
    .select()
    .single();

  if (error) {
    req.log.error({ error }, "Failed to create registration");
    res.status(500).json({ error: error.message });
    return;
  }

  req.log.info({ id: data.id, brand: data.brand, card_type: data.card_type }, "Registration created");
  res.status(201).json(toRegistration(data));
});

/* GET /registrations — list all (admin) */
router.get("/registrations", async (_req, res): Promise<void> => {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data ?? []).map(toRegistration));
});

/* GET /registrations/:id — get single */
router.get("/registrations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetRegistrationParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", parsed.data.id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  res.json(toRegistration(data));
});

/* PATCH /registrations/:id/status — approve or reject (admin) */
router.patch("/registrations/:id/status", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body as { status: string };

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "status must be approved or rejected" });
    return;
  }

  const { data, error } = await supabase
    .from("registrations")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  req.log.info({ id, status }, "Registration status updated");
  res.json(toRegistration(data));
});

/* Map snake_case Supabase columns → camelCase response */
function toRegistration(row: Record<string, unknown>) {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    emiratesId: row.emirates_id,
    brand: row.brand,
    cardType: row.card_type,
    region: row.region,
    streetAddress: row.street_address,
    neighborhood: row.neighborhood,
    deliveryDate: row.delivery_date,
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
  };
}

export default router;
