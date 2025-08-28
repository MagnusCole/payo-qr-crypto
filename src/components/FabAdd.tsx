import { Link } from 'react-router-dom';

export default function FabAdd(){
  return (
    <Link to="/add"
      className="fixed right-5 bottom-20 rounded-full px-5 py-3
                 text-white font-semibold bg-gradient-primary glow-primary">
      + Añadir
    </Link>
  );
}
