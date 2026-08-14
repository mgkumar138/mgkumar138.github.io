/* ══════════════════════════════════════════════════════════════════════════
   Tamil Open Data Repository — Firebase configuration
   ══════════════════════════════════════════════════════════════════════════

   Until the placeholders below are replaced, the repository page at
   #tamilrepo runs in DEMO MODE: the whole interface works — including the
   redaction tool — but sign-in and uploads are disabled and nothing is stored.

   Replace the six values with the ones from your Firebase project
   (Project settings → Your apps → Web app → SDK setup and configuration),
   then commit and push.

   These values are safe to commit publicly. They are identifiers, not
   secrets — every Firebase web app ships them in its page source. Your
   data is protected by the Security Rules, which is why setting those
   correctly matters. See TAMILREPO-SETUP.md for the exact rules to paste.
   ══════════════════════════════════════════════════════════════════════════ */

window.TAMILREPO_FIREBASE = {
  apiKey:            "PASTE_YOUR_API_KEY",
  authDomain:        "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
};
