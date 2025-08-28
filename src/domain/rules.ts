import { Transaction } from './types';

export function evaluateAlerts(txs: Transaction[], monthlyIncome: number) {
  const month = new Date().toISOString().slice(0,7); // YYYY-MM
  const monthSpend = txs
    .filter(t => t.type==='gasto' && t.date.startsWith(month))
    .reduce((a,b)=>a+b.amount,0);

  const alerts: string[] = [];
  if (monthlyIncome && monthSpend > monthlyIncome * 0.3)
    alerts.push('Estás gastando >30% de tu ingreso mensual.');
  // Regla simple de "no 50% de ahorros en 1 ítem" se aplicaría al crear gasto grande
  return alerts;
}
