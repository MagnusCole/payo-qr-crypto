import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Settings } from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

const BottomNav = ({ className }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-glass-border ${className || ''}`}>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-around items-center">
          <Button
            variant={isActive('/invoices') ? 'payo' : 'ghost'}
            className="flex flex-col gap-1 h-auto py-2 px-4"
            onClick={() => navigate('/invoices')}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Facturas</span>
          </Button>

          <Button
            variant="payo"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => navigate('/new-invoice')}
          >
            <Plus className="w-6 h-6" />
          </Button>

          <Button
            variant={isActive('/settings') ? 'payo' : 'ghost'}
            className="flex flex-col gap-1 h-auto py-2 px-4"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Ajustes</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
