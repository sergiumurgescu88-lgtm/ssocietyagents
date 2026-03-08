export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Politica de Confidențialitate</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: 8 Martie 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold">1. Date Colectate</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Colectăm următoarele tipuri de date: informații de cont (email, nume), date de utilizare 
              (proiecte, oportunități, activitate în platformă), date de plată (procesate securizat prin Stripe), 
              și date tehnice (IP, browser, dispozitiv).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Utilizarea Datelor</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Datele tale sunt folosite pentru: furnizarea serviciului, personalizarea recomandărilor AI, 
              comunicări despre cont și serviciu, îmbunătățirea platformei, și respectarea obligațiilor legale.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Stocarea și Securitatea Datelor</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Datele sunt stocate securizat în infrastructura cloud cu criptare în tranzit (TLS) și la rest. 
              Accesul la date este restricționat prin politici de securitate la nivel de rând (RLS).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Drepturile Tale (GDPR)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conform GDPR, ai următoarele drepturi:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><strong>Dreptul la acces</strong> — poți solicita o copie a tuturor datelor tale</li>
              <li><strong>Dreptul la rectificare</strong> — poți corecta datele incorecte din Setări → Profil</li>
              <li><strong>Dreptul la ștergere</strong> — poți solicita ștergerea completă a contului și datelor</li>
              <li><strong>Dreptul la portabilitate</strong> — poți exporta datele în format JSON</li>
              <li><strong>Dreptul la restricționare</strong> — poți solicita limitarea procesării datelor</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Aceste acțiuni sunt disponibile în Setări → Profil → Secțiunea "Date Personale".
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Partajarea Datelor</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nu vindem datele tale. Partajăm date doar cu: procesatorul de plăți (Stripe), 
              furnizori de AI (pentru generarea recomandărilor), și autorități când este cerut legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Cookie-uri</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Folosim cookie-uri esențiale pentru autentificare și funcționalitate. Nu folosim cookie-uri 
              de tracking sau publicitate de la terți.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Retenția Datelor</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Datele contului sunt păstrate cât timp ai un cont activ. După ștergerea contului, toate 
              datele personale sunt eliminate în maxim 30 de zile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Contact DPO</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pentru orice întrebări privind datele personale: privacy@ventureai.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
