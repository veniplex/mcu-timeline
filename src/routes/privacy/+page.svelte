<script lang="ts">
  import { locale } from "$lib/stores/locale";
</script>

<svelte:head>
  <title
    >{$locale === "de"
      ? "Datenschutzerklärung – MCU-Zeitleiste"
      : "Privacy Policy – MCU Timeline"}</title
  >
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12 sm:px-6">
  <!-- Language toggle -->
  <div class="mb-8 flex items-center gap-2 text-xs">
    <button
      class="rounded-full px-3 py-1 transition-colors {$locale === 'de'
        ? 'bg-primary text-white'
        : 'bg-muted text-muted-foreground hover:text-foreground'}"
      onclick={() => locale.set("de")}
    >
      Deutsch
    </button>
    <button
      class="rounded-full px-3 py-1 transition-colors {$locale === 'en'
        ? 'bg-primary text-white'
        : 'bg-muted text-muted-foreground hover:text-foreground'}"
      onclick={() => locale.set("en")}
    >
      English
    </button>
  </div>

  <article class="privacy-content">
    {#if $locale === "de"}
      <h2>Datenschutzerklärung</h2>
      <p class="text-muted-foreground text-sm"><strong>Stand: Juni 2026</strong></p>

      <hr />

      <h3>1. Verantwortlicher</h3>
      <p>
        Verantwortlich im Sinne der DSGVO ist:<br />
        <strong>veniplex</strong> · Kontakt:
        <a href="https://github.com/veniplex" target="_blank" rel="noopener noreferrer"
          >github.com/veniplex</a
        >
      </p>

      <hr />

      <h3>2. Welche Daten wir verarbeiten</h3>

      <h4>2.1 Local Storage (technisch notwendig)</h4>
      <p>
        Diese Website speichert Daten ausschließlich im <strong>Local Storage</strong> deines
        Browsers – nicht in Cookies. Dazu gehören:
      </p>
      <table>
        <thead>
          <tr><th>Schlüssel</th><th>Inhalt</th><th>Zweck</th></tr>
        </thead>
        <tbody>
          <tr><td><code>theme</code></td><td>hell / dunkel</td><td>Design-Einstellung</td></tr>
          <tr><td><code>locale</code></td><td>en / de</td><td>Spracheinstellung</td></tr>
          <tr><td><code>early-banner-dismissed</code></td><td>1</td><td>Hinweis-Banner ausgeblendet</td></tr>
          <tr><td><code>cookie-notice-dismissed</code></td><td>1</td><td>Datenschutz-Hinweis bestätigt</td></tr>
          <tr><td><code>gh-stars</code></td><td>Sterne-Anzahl (6 h gecacht)</td><td>Verringert API-Anfragen</td></tr>
        </tbody>
      </table>
      <p>
        Diese Daten verlassen deinen Browser nicht und werden nicht an uns übertragen.
        Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h4>2.2 Firebase Authentication &amp; Firestore (optional, nur bei Anmeldung)</h4>
      <p>
        Wenn du dich freiwillig mit Google oder GitHub anmeldest, werden über
        <strong>Firebase (Google LLC, USA)</strong> folgende Daten verarbeitet:
      </p>
      <ul>
        <li>E-Mail-Adresse, Anzeigename und Profilbild von deinem OAuth-Anbieter</li>
        <li>
          Dein Sehverlauf (markierte Filme/Serien/Episoden) und Einstellungen werden in
          <strong>Firestore</strong> unter deiner Firebase-UID gespeichert
        </li>
      </ul>
      <p>
        Firebase ist unter dem EU–US Data Privacy Framework zertifiziert. Rechtsgrundlage:
        Vertrag / Einwilligung (Art. 6 Abs. 1 lit. b, lit. a DSGVO). Du kannst dich jederzeit
        abmelden und deinen Verlauf in der App zurücksetzen.
      </p>
      <p>
        Firebase-Datenschutzerklärung:
        <a
          href="https://firebase.google.com/support/privacy"
          target="_blank"
          rel="noopener noreferrer">firebase.google.com/support/privacy</a
        >
      </p>

      <h4>2.3 Vercel Analytics &amp; Speed Insights</h4>
      <p>
        Wir verwenden <strong>Vercel Analytics</strong> und <strong>Vercel Speed Insights</strong>
        zur anonymen Nutzungsanalyse. Vercel erfasst Seitenaufrufe, Web Vitals sowie
        Gerätekategorie, Betriebssystem und Land (aus anonymisierter IP). Vercel setzt
        <strong>keine Cookies</strong> und speichert <strong>keine personenbezogenen Daten</strong>.
        IPs werden nicht vollständig gespeichert. Vercel ist DSGVO-konform und nach EU–US Data
        Privacy Framework zertifiziert. Rechtsgrundlage: berechtigtes Interesse
        (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        Vercel-Datenschutzerklärung:
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
          >vercel.com/legal/privacy-policy</a
        >
      </p>

      <h4>2.4 GitHub Stars API</h4>
      <p>
        Die Startseite ruft einmalig die öffentliche GitHub-API ab, um die Anzahl der Sterne
        anzuzeigen. Diese Anfrage enthält keine personenbezogenen Daten. Das Ergebnis wird
        6 Stunden im Local Storage gecacht.
      </p>

      <hr />

      <h3>3. Cookies</h3>
      <p>
        Diese Website setzt <strong>keine Tracking- oder Marketing-Cookies</strong>. Firebase
        Authentication kann technische Session-Cookies setzen, wenn du dich anmeldest – diese sind
        notwendig für die Authentifizierung und fallen unter Art. 6 Abs. 1 lit. b DSGVO.
      </p>

      <hr />

      <h3>4. Deine Rechte (DSGVO)</h3>
      <p>Du hast jederzeit das Recht auf:</p>
      <ul>
        <li><strong>Auskunft</strong> (Art. 15): Welche Daten wir über dich gespeichert haben.</li>
        <li><strong>Berichtigung</strong> (Art. 16): Korrektur unrichtiger Daten.</li>
        <li>
          <strong>Löschung</strong> (Art. 17): Über „Verlauf zurücksetzen" in der App löscht du
          deinen Sehverlauf. Für Kontolöschung:
          <a
            href="https://github.com/veniplex/mcu-timeline/issues"
            target="_blank"
            rel="noopener noreferrer">GitHub Issues</a
          >.
        </li>
        <li><strong>Einschränkung</strong> (Art. 18) und <strong>Widerspruch</strong> (Art. 21).</li>
        <li><strong>Datenübertragbarkeit</strong> (Art. 20).</li>
        <li><strong>Beschwerde</strong> bei einer Datenschutz-Aufsichtsbehörde.</li>
      </ul>
      <p>
        Kontakt:
        <a
          href="https://github.com/veniplex/mcu-timeline/issues"
          target="_blank"
          rel="noopener noreferrer">GitHub Issues</a
        >
      </p>

      <hr />

      <h3>5. Änderungen</h3>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Das Datum am
        Anfang gibt die jeweils aktuelle Fassung an.
      </p>
    {:else}
      <h2>Privacy Policy</h2>
      <p class="text-muted-foreground text-sm"><strong>Last updated: June 2026</strong></p>

      <hr />

      <h3>1. Controller</h3>
      <p>
        The controller within the meaning of the GDPR is:<br />
        <strong>veniplex</strong> · Contact:
        <a href="https://github.com/veniplex" target="_blank" rel="noopener noreferrer"
          >github.com/veniplex</a
        >
      </p>

      <hr />

      <h3>2. Data we process</h3>

      <h4>2.1 Local Storage (technically necessary)</h4>
      <p>
        This website stores data exclusively in your browser's <strong>Local Storage</strong> — not
        in cookies. This includes:
      </p>
      <table>
        <thead>
          <tr><th>Key</th><th>Content</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>theme</code></td><td>light / dark</td><td>UI theme preference</td></tr>
          <tr><td><code>locale</code></td><td>en / de</td><td>Language preference</td></tr>
          <tr><td><code>early-banner-dismissed</code></td><td>1</td><td>Notice banner hidden</td></tr>
          <tr><td><code>cookie-notice-dismissed</code></td><td>1</td><td>Privacy notice acknowledged</td></tr>
          <tr><td><code>gh-stars</code></td><td>Star count (cached 6 h)</td><td>Reduces API calls</td></tr>
        </tbody>
      </table>
      <p>
        This data never leaves your browser and is not transmitted to us. Legal basis: legitimate
        interest (Art. 6(1)(f) GDPR).
      </p>

      <h4>2.2 Firebase Authentication &amp; Firestore (optional, only when signed in)</h4>
      <p>
        If you voluntarily sign in with Google or GitHub, <strong>Firebase (Google LLC, USA)</strong>
        processes the following:
      </p>
      <ul>
        <li>E-mail address, display name and profile picture from your OAuth provider</li>
        <li>
          Your watch history (marked films/series/episodes) and preferences are stored in
          <strong>Firestore</strong> under your Firebase UID
        </li>
      </ul>
      <p>
        Firebase is certified under the EU–US Data Privacy Framework. Legal basis: contract /
        consent (Art. 6(1)(b), (a) GDPR). You can sign out at any time and reset your history via
        the app.
      </p>
      <p>
        Firebase Privacy Policy:
        <a
          href="https://firebase.google.com/support/privacy"
          target="_blank"
          rel="noopener noreferrer">firebase.google.com/support/privacy</a
        >
      </p>

      <h4>2.3 Vercel Analytics &amp; Speed Insights</h4>
      <p>
        We use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to
        understand site usage anonymously and improve performance. Vercel collects page views, Web
        Vitals, and device category, OS and country (derived from an anonymised IP). Vercel sets
        <strong>no cookies</strong> and stores <strong>no personal data</strong>. IPs are not stored
        in full. Vercel is GDPR-compliant and certified under the EU–US Data Privacy Framework.
        Legal basis: legitimate interest (Art. 6(1)(f) GDPR).
      </p>
      <p>
        Vercel Privacy Policy:
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
          >vercel.com/legal/privacy-policy</a
        >
      </p>

      <h4>2.4 GitHub Stars API</h4>
      <p>
        The homepage calls the public GitHub API once to display the star count. This request
        contains no personal data. The result is cached in Local Storage for 6 hours.
      </p>

      <hr />

      <h3>3. Cookies</h3>
      <p>
        This website sets <strong>no tracking or marketing cookies</strong>. Firebase Authentication
        may set technical session cookies when you sign in — these are necessary for authentication
        and fall under Art. 6(1)(b) GDPR.
      </p>

      <hr />

      <h3>4. Your Rights (GDPR)</h3>
      <p>You have the right at any time to:</p>
      <ul>
        <li><strong>Access</strong> (Art. 15): Find out what data we hold about you.</li>
        <li><strong>Rectification</strong> (Art. 16): Correct inaccurate data.</li>
        <li>
          <strong>Erasure</strong> (Art. 17): Use "Reset watch history" in the app; for account
          deletion contact us via
          <a
            href="https://github.com/veniplex/mcu-timeline/issues"
            target="_blank"
            rel="noopener noreferrer">GitHub Issues</a
          >.
        </li>
        <li><strong>Restriction</strong> (Art. 18) and <strong>objection</strong> (Art. 21).</li>
        <li><strong>Data portability</strong> (Art. 20).</li>
        <li><strong>Lodge a complaint</strong> with a data protection supervisory authority.</li>
      </ul>
      <p>
        Contact:
        <a
          href="https://github.com/veniplex/mcu-timeline/issues"
          target="_blank"
          rel="noopener noreferrer">GitHub Issues</a
        >
      </p>

      <hr />

      <h3>5. Changes</h3>
      <p>
        We reserve the right to update this Privacy Policy when necessary. The date at the top
        indicates the current version.
      </p>
    {/if}
  </article>

  <p class="mt-12 text-xs text-muted-foreground">
    <a href="/" class="underline-offset-2 hover:underline">
      {$locale === "de" ? "← Zurück zur Zeitleiste" : "← Back to timeline"}
    </a>
  </p>
</div>

<style>
  .privacy-content :global(h2) {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    margin-top: 0;
  }
  .privacy-content :global(h3) {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  .privacy-content :global(h4) {
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.375rem;
  }
  .privacy-content :global(p) {
    font-size: 0.875rem;
    line-height: 1.75;
    margin-bottom: 0.75rem;
    color: var(--color-muted-foreground);
  }
  .privacy-content :global(hr) {
    border-color: var(--color-border);
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .privacy-content :global(ul) {
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
    list-style: disc;
  }
  .privacy-content :global(li) {
    margin-bottom: 0.25rem;
    line-height: 1.6;
  }
  .privacy-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .privacy-content :global(th) {
    text-align: left;
    padding-bottom: 0.5rem;
    padding-right: 1rem;
    border-bottom: 1px solid var(--color-border);
    font-weight: 600;
    font-size: 0.75rem;
  }
  .privacy-content :global(td) {
    padding: 0.375rem 1rem 0.375rem 0;
    border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
    color: var(--color-muted-foreground);
  }
  .privacy-content :global(code) {
    background: var(--color-muted);
    padding: 0.1em 0.35em;
    border-radius: 0.25rem;
    font-size: 0.8em;
  }
  .privacy-content :global(a) {
    color: var(--color-accent);
    text-underline-offset: 2px;
  }
  .privacy-content :global(a:hover) {
    text-decoration: underline;
  }
  .privacy-content :global(strong) {
    color: var(--color-foreground);
  }
</style>
