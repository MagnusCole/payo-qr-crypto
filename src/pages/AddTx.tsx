import { useFinance } from '@/store/useFinance';
import { Category, TxType } from '@/domain/types';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function AddTx(){
  const { addTx } = useFinance();
  const navigate = useNavigate();
  const [amount,setAmount] = useState<number>(0);
  const [type,setType] = useState<TxType>('gasto');
  const [category,setCategory] = useState<Category>('comida');
  const [note,setNote] = useState('');

  return (
    <div className="container max-w-md space-y-4">
      <h2 className="text-xl font-bold">Nueva transacción</h2>
      <input className="glass w-full p-3 rounded-xl"
             type="number" placeholder="Monto" onChange={e=>setAmount(+e.target.value)} />
      <select className="glass w-full p-3 rounded-xl" onChange={e=>setType(e.target.value as TxType)}>
        <option value="gasto">Gasto</option><option value="ingreso">Ingreso</option>
      </select>
      <select className="glass w-full p-3 rounded-xl" onChange={e=>setCategory(e.target.value as Category)}>
        {['comida','transporte','ocio','inversion','otros'].map(c=><option key={c}>{c}</option>)}
      </select>
      <textarea className="glass w-full p-3 rounded-xl" placeholder="Notas" onChange={e=>setNote(e.target.value)} />
      <button
        className="w-full rounded-xl bg-gradient-primary text-white py-3 glow-primary"
        onClick={()=>{
          if(!amount) return;
          addTx({ id: uuid(), amount, type, category, note, date: new Date().toISOString() });
          navigate('/dashboard');
        }}>
        Guardar
      </button>
    </div>
  );
}
