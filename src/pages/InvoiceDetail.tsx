import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PayoLogo } from '@/components/PayoLogo';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, RefreshCw, ExternalLink, CheckCircle, Clock, AlertCircle, Zap, Bitcoin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { toast } = useToast();

  // Mock invoice data
  const invoice = {
    id: invoiceId,
    amount: 150,
    currency: 'PEN',
    cryptoAmount: '0.00234',
    cryptoCurrency: 'BTC',
    status: 'paid',
    method: 'lightning',
    description: 'Consultoría web',
    address: 'lnbc1234567890abcdef...',
    txHash: '1a2b3c4d5e6f...',
    blockHeight: 825432,
    confirmations: 6,
    createdAt: new Date('2024-01-15T10:30:00'),
    detectedAt: new Date('2024-01-15T10:32:15'),
    confirmedAt: new Date('2024-01-15T10:35:20'),
    webhookSent: true
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'lightning':
        return <Zap className="w-5 h-5" />;
      case 'bitcoin':
        return <Bitcoin className="w-5 h-5" />;
      case 'usdc':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Bitcoin className="w-5 h-5" />;
    }
  };

  const timelineEvents = [
    {
      title: 'Cobro creado',
      time: invoice.createdAt,
      icon: <Clock className="w-4 h-4" />,
      status: 'completed'
    },
    {
      title: 'Pago detectado',
      time: invoice.detectedAt,
      icon: <AlertCircle className="w-4 h-4" />,
      status: 'completed'
    },
    {
      title: 'Pago confirmado',
      time: invoice.confirmedAt,
      icon: <CheckCircle className="w-4 h-4" />,
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="glass-subtle border-glass-border"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PayoLogo size="md" />
          <div className="flex-1" />
          <Badge variant="success" className="flex items-center gap-1">
            {getStatusIcon(invoice.status)}
            Pagado
          </Badge>
        </div>

        {/* Main Invoice Info */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Cobro #{invoice.id}</CardTitle>
                <p className="text-muted-foreground">{invoice.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {getMethodIcon(invoice.method)}
                <span className="text-sm capitalize">{invoice.method}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monto solicitado</p>
                  <p className="text-2xl font-bold">S/. {invoice.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Equivalente cripto</p>
                  <p className="text-lg font-semibold">
                    {invoice.cryptoAmount} {invoice.cryptoCurrency}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invoice.status)}
                    <span className="font-medium">Confirmado</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmaciones</p>
                  <p className="text-lg font-semibold">{invoice.confirmations}/1</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle>Historial de estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.time.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle>Detalles técnicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {invoice.method === 'lightning' ? 'Invoice Lightning' : 'Dirección'}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                      {invoice.address}
                    </code>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(invoice.address, 'Dirección')}
                      className="glass-subtle border-glass-border"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {invoice.txHash && (
                  <div>
                    <p className="text-sm text-muted-foreground">Hash de transacción</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                        {invoice.txHash}
                      </code>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(invoice.txHash!, 'Hash')}
                        className="glass-subtle border-glass-border"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {invoice.blockHeight && (
                  <div>
                    <p className="text-sm text-muted-foreground">Altura de bloque</p>
                    <p className="font-mono">{invoice.blockHeight.toLocaleString()}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Webhook</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${invoice.webhookSent ? 'text-success' : 'text-warning'}`}>
                      {invoice.webhookSent ? '✅ Enviado' : '⏳ Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="glass-subtle border-glass-border">
            <Copy className="w-4 h-4 mr-2" />
            Copiar enlace
          </Button>
          
          <Button variant="outline" className="glass-subtle border-glass-border">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar webhook
          </Button>
          
          <Button variant="outline" className="glass-subtle border-glass-border">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver en explorer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;