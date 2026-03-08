import { useAppStore } from "@/stores/app-store";
import { OpportunityCard } from "@/components/OpportunityCard";

export default function Opportunities() {
  const { opportunities } = useAppStore();

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Oportunități</h1>
        <p className="text-sm text-muted-foreground">Scanner zilnic de oportunități de business</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}
