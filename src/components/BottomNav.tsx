import { Link, useLocation } from 'react-router-dom';

export default function BottomNav(){
  const { pathname } = useLocation();
  const item = (to:string,label:string)=>(
    <Link to={to}
      className={`px-4 py-2 rounded-xl glass border border-white/10
      ${pathname===to?'bg-white/10 glow-subtle':'bg-white/5'}`}>
      {label}
    </Link>
  );
  return (
    <nav className="fixed bottom-4 inset-x-0 mx-auto w-fit gap-2 flex p-2
                    glass rounded-2xl shadow-lg z-50">
      {item('/dashboard','Dashboard')}
      {item('/suggestions','Sugerencias')}
      {item('/currency','Divisas')}
    </nav>
  );
}
