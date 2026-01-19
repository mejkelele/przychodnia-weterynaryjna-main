# Przychodnia Weterynaryjna — Dokumentacja techniczna (skrócona)

## 1. Opis
Aplikacja webowa do zarządzania przychodnią weterynaryjną:
- konta użytkowników i profil,
- zwierzaki (CRUD),
- wizyty (tworzenie, akceptacja/odrzucenie, edycja, statusy).

## 2. Stos technologiczny
- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **Baza danych**: lokalnie `dev.db` (typowo SQLite w dev)
- **Middleware**: `middleware.ts` (ochrona tras / logika dostępu)

## 3. Architektura
- UI: komponenty React (`use client` tam, gdzie potrzebne interakcje).
- Mutacje danych: **Server Actions** (`"use server"`) w `lib/actions`.
- Dostęp do danych: `db` z `@/lib/db` (Prisma Client).
- Sesja i role: `getSession()` z `@/lib/session`.

**Wzorzec mutacji:**
UI → Server Action → walidacja sesji/roli → zapis do DB → `revalidatePath(...)` → (opcjonalnie) `redirect(...)`.

## 4. Model domenowy (z kodu akcji)
- **User**: `id`, `role` (`owner`, `vet`, `admin`), `name`, `lastName`, `email`, `phone`, `address`
- **Pet**: `id`, `name`, `species`, `breed?`, `birthDate`, `weight`, `sex`, `notes?`, `imageUrl?`, `ownerId`
- **Visit**: `id`, `petId`, `description`, `type`, `date`, `status` (`pending`/`confirmed`/`cancelled`), `price`, `vetId?`

## 5. Role i uprawnienia (z akcji)
- **owner**
  - zarządza tylko swoimi zwierzakami (sprawdzane `pet.ownerId === session.userId`)
  - tworząc wizytę: status `pending`
- **vet/admin (staff)**
  - może tworzyć zwierzaki dla wybranego właściciela (`ownerId` z formularza)
  - tworząc wizytę: status `confirmed` + `vetId`
  - może akceptować/odrzucać/edytować wizyty

## 6. Server Actions — skrót
### Pets
- `createPetAction(prevState, formData)`
  - walidacja pól, tworzenie zwierzaka, `revalidatePath("/pets")`, `redirect("/pets")`
- `updatePetAction(prevState, formData)`
  - weryfikacja uprawnień owner/staff, update, `revalidatePath("/pets")` i `/pets/:id`
- `deletePetAction(petId)`
  - owner: kontrola własności, delete, `revalidatePath("/pets")`

### Visits
- `createVisitAction(formData)`
  - walidacja daty (blokada wstecz), status `confirmed` dla staff / `pending` dla owner, `revalidatePath("/visits")` i powiązane
- `acceptVisitAction(formData)` (staff)
  - ustawia `confirmed`, `vetId`, `price`
- `rejectVisitAction(visitId)`
  - `status = cancelled`
- `editVisitAction(formData)` (staff)
  - update opis/diagnoza/cena/status

### User
- `updateUserAction(formData)`
  - update profilu, `revalidatePath("/dashboard/profile")`

## 7. Cache / rewalidacja
Po mutacjach używane jest `revalidatePath(...)` (np. `/pets`, `/visits`, `/pets/:id`) aby odświeżyć dane SSR/segmenty.

## 8. Redirect po usuwaniu zwierzaka
Jeśli usuwanie jest wywoływane z **client** (np. `onClick`), to `redirect()` w Server Action nie zadziała.
Wtedy po `await deletePetAction(petId)` robisz:
- `router.push("/pets")` po stronie klienta.

Jeśli chcesz `redirect()` z serwera — wywołuj delete jako `<form action={...}>`.

## 9. Uruchomienie lokalne (typowo)
```bash
npm install
# jeśli Prisma:
npx prisma generate
npx prisma migrate dev
npm run dev
