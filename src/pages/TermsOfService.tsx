export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Termeni și Condiții</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: 8 Martie 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold">1. Acceptarea Termenilor</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prin accesarea și utilizarea platformei VentureAI, accepți acești termeni și condiții în totalitate. 
              Dacă nu ești de acord cu oricare dintre acești termeni, te rugăm să nu utilizezi serviciul.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Descrierea Serviciului</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              VentureAI este o platformă care folosește inteligența artificială pentru a ajuta utilizatorii să 
              identifice oportunități de business, să gestioneze proiecte și agenți AI, și să își monitorizeze veniturile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Conturi de Utilizator</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ești responsabil pentru menținerea confidențialității contului tău și a parolei. Trebuie să ne 
              notifici imediat în cazul oricărei utilizări neautorizate a contului tău.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Planuri și Plăți</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              VentureAI oferă planuri gratuite și plătite. Plățile sunt procesate prin Stripe și sunt 
              non-refundabile, cu excepția cazurilor prevăzute de lege. Prețurile pot fi modificate cu un 
              preaviz de 30 de zile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Utilizare Acceptabilă</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nu ai voie să utilizezi platforma pentru activități ilegale, să încerci să accesezi neautorizat 
              sistemele noastre, sau să distribui conținut dăunător. Ne rezervăm dreptul de a suspenda 
              conturile care încalcă acești termeni.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Proprietate Intelectuală</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conținutul generat de AI prin platforma noastră îți aparține. Cu toate acestea, platforma 
              VentureAI, inclusiv codul sursă, designul și marca, rămân proprietatea noastră.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Limitarea Răspunderii</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              VentureAI nu garantează că oportunitățile identificate vor genera venituri. Orice decizie de 
              business luată pe baza informațiilor din platformă este responsabilitatea ta exclusivă.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Modificări ale Termenilor</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările semnificative 
              vor fi comunicate prin email sau notificare in-app cu cel puțin 14 zile înainte de intrarea în vigoare.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pentru întrebări despre acești termeni, ne poți contacta la: support@ventureai.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
