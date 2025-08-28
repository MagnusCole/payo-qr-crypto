import { create } from 'zustand';
import { Budget, Transaction } from '@/domain/types';

type State = {
  txs: Transaction[];
  budget: Budget | null;
  addTx: (t: Transaction) => void;
  removeTx: (id: string) => void;
  setBudget: (b: Budget) => void;
  load: () => void;
  persist: () => void;
};

export const useFinance = create<State>((set, get) => ({
  txs: [],
  budget: null,
  addTx: (t) => { set(s => ({ txs: [t, ...s.txs] })); get().persist(); },
  removeTx: (id) => { set(s => ({ txs: s.txs.filter(x => x.id!==id) })); get().persist(); },
  setBudget: (b) => { set({ budget: b }); get().persist(); },
  load: () => {
    const raw = localStorage.getItem('finance:v1');
    if (raw) set(JSON.parse(raw));
  },
  persist: () => {
    const { txs, budget } = get();
    localStorage.setItem('finance:v1', JSON.stringify({ txs, budget }));
  }
}));
