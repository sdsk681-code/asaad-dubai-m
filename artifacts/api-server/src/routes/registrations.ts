import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, registrationsTable } from "@workspace/db";
import { CreateRegistrationBody, GetRegistrationParams } from "@workspace/api-zod";

const router: IRouter = Router();

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

export default router;
