import { useFinance } from '@/store/useFinance';
import { evaluateAlerts } from '@/domain/rules';

export default function Suggestions(){
  const { txs, budget } = useFinance();
  const alerts = evaluateAlerts(txs, budget?.monthlyIncome || 0);

  return (
    <div className="container max-w-xl space-y-3">
      <h2 className="text-xl font-bold">Sugerencias</h2>
      {alerts.length===0 && <div className="glass p-4 rounded-xl">Sin alertas 🎉</div>}
      {alerts.map((a,i)=>(
        <div key={i} className="glass p-4 rounded-xl border-l-4 border-warning glow-subtle">
          {a}
        </div>
      ))}
      <div className="glass p-4 rounded-xl">
        Modo coach:
        <div className="mt-2 flex gap-2">
          <button className="glass px-3 py-2 rounded-lg">Serio</button>
          <button className="glass px-3 py-2 rounded-lg">Amigable</button>
        </div>
      </div>
    </div>
  );
}
