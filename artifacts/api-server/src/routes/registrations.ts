import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, registrationsTable } from "@workspace/db";
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

  const [registration] = await db
    .insert(registrationsTable)
    .values({
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      emiratesId: parsed.data.emiratesId,
      brand: parsed.data.brand,
      cardType: parsed.data.cardType,
      region: parsed.data.region,
      streetAddress: parsed.data.streetAddress,
      neighborhood: parsed.data.neighborhood,
      deliveryDate: parsed.data.deliveryDate,
      paymentMethod: parsed.data.paymentMethod,
    })
    .returning();

  req.log.info({ id: registration.id, brand: registration.brand, cardType: registration.cardType }, "Registration created");
  res.status(201).json(registration);
});

/* GET /registrations — list all (admin) */
router.get("/registrations", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(registrationsTable)
    .orderBy(desc(registrationsTable.createdAt));
  res.json(rows);
});

/* GET /registrations/:id — get single */
router.get("/registrations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetRegistrationParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [registration] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, parsed.data.id));

  if (!registration) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  res.json(registration);
});

/* PATCH /registrations/:id/status — approve or reject (admin) */
router.patch("/registrations/:id/status", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body as { status: string };

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "status must be approved or rejected" });
    return;
  }

  const [updated] = await db
    .update(registrationsTable)
    .set({ status })
    .where(eq(registrationsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  req.log.info({ id, status }, "Registration status updated");
  res.json(updated);
});

export default router;
