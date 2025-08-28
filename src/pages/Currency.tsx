import { useMemo, useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function Currency(){
  const [pair] = useState('USD/PEN');
  const [data, setData] = useState<{date: string; usd_pen: number}[]>([]);

  useEffect(() => {
    fetch('/data/rates.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading rates:', err));
  }, []);

  const chartData = useMemo(() =>
    data.map(item => ({
      d: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      v: item.usd_pen
    })), [data]);

  return (
    <div className="container max-w-2xl space-y-4">
      <h2 className="text-xl font-bold">Divisas — {pair}</h2>
      <div className="glass p-4 rounded-2xl h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="d"/><YAxis domain={['dataMin-0.05','dataMax+0.05']}/>
            <Tooltip/>
            <Line type="monotone" dataKey="v" stroke="url(#g)" dot={false}/>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--secondary))"/>
                <stop offset="100%" stopColor="hsl(var(--primary))"/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
