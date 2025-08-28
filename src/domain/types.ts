export type Category = 'comida'|'transporte'|'ocio'|'inversion'|'otros';
export type TxType = 'gasto'|'ingreso';

export interface Transaction {
  id: string;
  amount: number;        // en moneda base
  type: TxType;
  category: Category;
  note?: string;
  date: string;          // ISO
  currency?: string;     // opcional si luego usas multimoneda
}

export interface Budget {
  monthlyIncome: number;
  currency: string;      // p.ej. "USD" o "PEN"
}
