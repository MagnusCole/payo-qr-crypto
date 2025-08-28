import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PayoLogo } from '@/components/PayoLogo';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Download, Zap, Bitcoin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const mockInvoices = [
    {
      id: '1',
      amount: 150,
      currency: 'PEN',
      cryptoAmount: '0.00234',
      cryptoCurrency: 'BTC',
      status: 'paid',
      description: 'Consultoría web',
      createdAt: new Date('2024-01-15T10:30:00'),
      method: 'lightning'
    },
    {
      id: '2',
      amount: 75,
      currency: 'PEN',
      cryptoAmount: '25.5',
      cryptoCurrency: 'USDC',
      status: 'pending',
      description: 'Diseño logo',
      createdAt: new Date('2024-01-15T14:20:00'),
      method: 'usdc'
    },
    {
      id: '3',
      amount: 300,
      currency: 'PEN',
      cryptoAmount: '0.00712',
      cryptoCurrency: 'BTC',
      status: 'expired',
      description: 'Desarrollo app',
      createdAt: new Date('2024-01-14T16:45:00'),
      method: 'bitcoin'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'lightning':
        return <Zap className="w-4 h-4" />;
      case 'bitcoin':
        return <Bitcoin className="w-4 h-4" />;
      case 'usdc':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Bitcoin className="w-4 h-4" />;
    }
  };

  const latestInvoice = mockInvoices[0];

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass shadow-glow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pagos del mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+20% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-glow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total recaudado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/. 2,340</div>
              <p className="text-xs text-muted-foreground">En cripto este mes</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-glow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasa de éxito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Facturas pagadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Invoice */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Último cobro
              <Badge 
                variant={getStatusVariant(latestInvoice.status) as any}
                className="flex items-center gap-1"
              >
                {getStatusIcon(latestInvoice.status)}
                {latestInvoice.status === 'paid' ? 'Pagado' : 
                 latestInvoice.status === 'pending' ? 'Pendiente' : 'Expirado'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  S/. {latestInvoice.amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {latestInvoice.cryptoAmount} {latestInvoice.cryptoCurrency}
                </p>
                <p className="text-sm text-muted-foreground">
                  {latestInvoice.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getMethodIcon(latestInvoice.method)}
                <span className="text-sm capitalize">{latestInvoice.method}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Facturas recientes</CardTitle>
              <Button variant="glass" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-4 glass-subtle rounded-lg hover:shadow-glow-subtle transition-glow cursor-pointer"
                  onClick={() => navigate(`/invoice/${invoice.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(invoice.method)}
                      <Badge 
                        variant={getStatusVariant(invoice.status) as any}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status === 'paid' ? 'Pagado' : 
                         invoice.status === 'pending' ? 'Pendiente' : 'Expirado'}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">S/. {invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {invoice.cryptoAmount} {invoice.cryptoCurrency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Beta Banner */}
        <Card className="glass shadow-glow-subtle border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Payo Beta: 0% comisión</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta tu e-commerce y automatiza los pagos
                </p>
              </div>
              <Button variant="payo">
                Configurar webhooks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            variant="payo"
            size="xl"
            className="rounded-full shadow-glow-primary"
            onClick={() => navigate('/create-invoice')}
          >
            <Plus className="w-6 h-6 mr-2" />
            Nuevo Cobro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;