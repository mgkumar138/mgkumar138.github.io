# Tamil Open Data Repository — setup

The page lives at `https://mgkumar138.github.io/#tamilrepo`, reached from
**Beyond Research → Tamil + AI**. It works right now in **demo mode**: everything
is visible and the redaction tool is fully functional, but sign-in and uploads
are disabled until Firebase is connected.

Total setup time: about 15 minutes. You need a Google account. The free tier
(5 GB storage, 50k reads/day) is far more than a pilot will use.

---

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and click **Create a project**.
2. Name it something like `tamil-open-data`. Google Analytics is not needed — turn it off.
3. Once created, click the **`</>`** (Web) icon to register a web app. Nickname it `tamilrepo`.
   **Do not** tick "Also set up Firebase Hosting" — GitHub Pages already hosts the site.
4. Firebase shows you a `firebaseConfig` object. Copy the six values into
   `tamilrepo-config.js`, replacing the `PASTE_…` placeholders.

Those values are safe to commit publicly — they are identifiers, not secrets.
Every Firebase web app ships them in its page source. Your data is protected by
the Security Rules in steps 3 and 4, so get those right.

---

## 2. Enable email-link sign-in

**Build → Authentication → Get started → Sign-in method**

1. Select **Email/Password** and enable it.
2. In the same panel, also enable **Email link (passwordless sign-in)**. Save.

Then **Authentication → Settings → Authorized domains → Add domain**:

```
mgkumar138.github.io
```

Without this the emailed link will be rejected. `localhost` is already
authorised, which is handy for testing.

Email-link sign-in *is* the email verification: a teacher can only get in by
opening a link sent to the address they entered. There is no separate step and
no password to manage.

---

## 3. Create the Firestore database

**Build → Firestore Database → Create database** → start in **production mode**
→ choose location **`asia-southeast1` (Singapore)**.

> Choose Singapore deliberately. When MOE asks where the data lives, "in
> Singapore" is a much better answer than "somewhere in Iowa". The location
> cannot be changed later without recreating the database.

Then open the **Rules** tab and replace everything with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // A teacher may read and write only their own profile.
    match /teachers/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Signed-in teachers may create contributions and read back their own.
    // Nobody can edit or delete via the client — that is deliberate, so the
    // record of what was submitted cannot be quietly altered.
    match /contributions/{doc} {
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow read:   if request.auth != null
                    && resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }

    // The public counter: anyone may read, only signed-in teachers may add to it.
    match /stats/corpus {
      allow read:  if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish**.

---

## 4. Create Cloud Storage

**Build → Storage → Get started** → production mode → same
**`asia-southeast1`** location.

Open the **Rules** tab and replace everything with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /contributions/{uid}/{file} {
      // A teacher may upload into their own folder, up to 25 MB per file,
      // and read back only their own uploads. Nothing is publicly readable.
      allow write: if request.auth != null
                   && request.auth.uid == uid
                   && request.resource.size < 25 * 1024 * 1024;
      allow read:  if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Click **Publish**.

You read everything through the Firebase console as project owner, so
contributors' files are private to them and to you — not to each other, and not
to the public.

---

## 5. Seed the counter

**Firestore → Start collection**

- Collection ID: `stats`
- Document ID: `corpus`
- Fields, all of type **number**, all set to `0`: `tokens`, `pages`, `items`, `teachers`

Save. The counter on the page will now show live figures.

> `teachers` does not auto-increment — the client cannot count registered users
> without being able to read everyone's profiles, which would be a poor trade.
> Update it by hand as accounts are created (Authentication tab shows the count),
> or add a Cloud Function later if the pilot grows.

---

## 6. Commit and test

```bash
git add index.html tamilrepo-config.js TAMILREPO-SETUP.md
git commit -m "Add Tamil Open Data Repository pilot"
git push
```

GitHub Pages takes a minute or two. Then check:

1. Visit `https://mgkumar138.github.io/#tamilrepo` — the demo banner should be gone.
2. Register with a real address. The email arrives from `noreply@<project>.firebaseapp.com`
   — **check spam**, and warn teachers to do the same.
3. Open the link. You should land signed in, with your name in the bar.
4. Upload a test photo, drag a black box over something, submit.
5. Confirm the file appears under **Storage → contributions/** and the counter moves.
6. Delete the test contribution from the console before showing it to anyone.

---

## Reviewing what comes in

- **Files**: Firebase console → Storage → `contributions/<uid>/`
- **Metadata**: Firestore → `contributions` (material type, level, pages, notes, contributor)
- **Contributors**: Firestore → `teachers`

To export everything for analysis, install the CLI and pull the bucket:

```bash
npm install -g firebase-tools
firebase login
gsutil -m cp -r gs://<your-bucket>/contributions ./tamil-corpus
```

---

## Things worth knowing before you promise anything

- **Anyone with an email address can register.** The institution field is
  declared, not verified. That is the right trade for a pilot — restricting to
  `@moe.edu.sg` would exclude community and overseas Tamil teachers — but review
  the `teachers` collection before treating the corpus as authoritative. If you
  want a stronger gate later, add an `approved: false` field and require it in
  the rules.
- **Redaction is burned into the image, not layered over it.** The uploaded JPEG
  genuinely has black pixels where the name was, and re-encoding through the
  canvas strips EXIF metadata including GPS. Original files never leave the
  teacher's browser.
- **Digital files are uploaded as-is** to preserve the text layer, which is far
  more valuable for training than an image. So redaction of Word and PDF files
  depends entirely on the teacher editing the document first. The page says this
  plainly; say it out loud too when you present.
- **PDFs in the handwritten tab are converted to images**, capped at 30 pages.
  That loses the text layer, so route text-bearing PDFs through the digital tab.
- **PDPA.** Student work is personal data even with names removed. For anything
  beyond a small pilot, get school or MOE clearance before collecting at scale.
  Removing names reduces the risk; it does not eliminate it, since handwriting
  and content can be identifying.

---

## If you would rather not use Firebase

The page degrades cleanly: leave `tamilrepo-config.js` untouched and it stays in
demo mode — still perfectly presentable as a mockup for the pitch. All backend
code is confined to the `initBackend()` function in `index.html`, so swapping in
Supabase or another provider means rewriting that one function.
