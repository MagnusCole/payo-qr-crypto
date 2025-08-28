import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayoLogo } from '@/components/PayoLogo';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import FabAdd from '@/components/FabAdd';
import { useFinance } from '@/store/useFinance';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard(){
  const { txs, load } = useFinance();
  useEffect(()=>{ load(); },[load]);
  const navigate = useNavigate();

  // Calcular estadísticas
  const totalIncome = txs.filter(t => t.type === 'ingreso').reduce((a,b) => a + b.amount, 0);
  const totalExpenses = txs.filter(t => t.type === 'gasto').reduce((a,b) => a + b.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Datos para el gráfico de categorías
  const categoryData = txs
    .filter(t => t.type === 'gasto')
    .reduce((acc, tx) => {
      const existing = acc.find(item => item.name === tx.category);
      if (existing) {
        existing.value += tx.amount;
      } else {
        acc.push({ name: tx.category, value: tx.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <PayoLogo size="md" />
          <div className="flex items-center gap-3">
            <Button
              variant="glass"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass shadow-glow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/. {balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ingresos - Gastos</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-glow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">S/. {totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total recibido</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-glow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">S/. {totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total gastado</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Pie Chart */}
        {categoryData.length > 0 && (
          <Card className="glass shadow-glow-subtle">
            <CardHeader>
              <CardTitle>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {txs.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 glass-subtle rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'ingreso' ? 'bg-success/20' : 'bg-danger/20'
                    }`}>
                      <span className={`text-sm font-bold ${
                        tx.type === 'ingreso' ? 'text-success' : 'text-danger'
                      }`}>
                        {tx.type === 'ingreso' ? '+' : '-'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.category}</p>
                      {tx.note && <p className="text-sm text-muted-foreground">{tx.note}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'ingreso' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'ingreso' ? '+' : '-'}S/. {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {txs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay transacciones aún</p>
                  <p className="text-sm text-muted-foreground">¡Agrega tu primera transacción!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <FabAdd />
        <BottomNav />
      </div>
    </div>
  );
}