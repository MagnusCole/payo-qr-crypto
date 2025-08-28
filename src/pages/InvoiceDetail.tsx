import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PayoLogo } from '@/components/PayoLogo';
import { BottomNav } from '@/components/BottomNav';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, RefreshCw, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInvoice } from '@/store/usePayo';
import { getStatusConfig, getCryptoConfig, formatPENAmount, formatCryptoAmount } from '@/domain/rules';

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { toast } = useToast();

  const { data: invoice, isLoading, error } = useInvoice(invoiceId!, true);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <PayoLogo size="lg" />
          <p className="text-muted-foreground">Cargando detalles de la factura...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <PayoLogo size="lg" />
          <Card className="glass shadow-glow-subtle border-danger/20">
            <CardContent className="pt-8 text-center space-y-6">
              <AlertCircle className="w-8 h-8 text-danger mx-auto" />
              <div>
                <h1 className="text-2xl font-bold mb-2">Error</h1>
                <p className="text-muted-foreground">
                  No se pudo cargar la información de la factura
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(invoice.status);
  const cryptoConfig = getCryptoConfig(invoice.method);

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'detected':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      case 'underpaid':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/invoices')}
            className="glass-subtle border-glass-border"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PayoLogo size="md" />
          <div className="flex-1" />
          <Badge variant={statusConfig.color === 'muted' ? 'outline' : statusConfig.color as 'success' | 'warning' | 'danger' | 'secondary'} className="flex items-center gap-1">
            {statusConfig.label}
          </Badge>
        </div>

        {/* Main Invoice Info */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Factura #{invoice.id}</CardTitle>
                <p className="text-muted-foreground">{invoice.description || 'Sin descripción'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{cryptoConfig.icon}</span>
                <span className="text-sm">{cryptoConfig.name}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monto solicitado</p>
                  <p className="text-2xl font-bold">{formatPENAmount(invoice.amount_pen)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Equivalente cripto</p>
                  <p className="text-lg font-semibold">
                    {formatCryptoAmount(invoice.amount_crypto, invoice.method)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{statusConfig.label}</span>
                  </div>
                </div>
                {invoice.payment && (
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmaciones</p>
                    <p className="text-lg font-semibold">{invoice.payment.confirmations} confirmaciones</p>
                  </div>
                )}
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
              {invoice.state_timeline.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.status === 'confirmed' ? 'bg-success' :
                    event.status === 'detected' ? 'bg-secondary' :
                    event.status === 'expired' ? 'bg-danger' : 'bg-muted'
                  }`}>
                    {getTimelineIcon(event.status)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {event.status === 'pending' ? 'Factura creada' :
                       event.status === 'detected' ? 'Pago detectado' :
                       event.status === 'confirmed' ? 'Pago confirmado' :
                       event.status === 'expired' ? 'Factura expirada' :
                       event.status === 'underpaid' ? 'Pago insuficiente' : 'Estado desconocido'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.at.toLocaleString()}
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
                    {invoice.method === 'BTC_LN' ? 'Invoice Lightning' : 'Dirección'}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                      {invoice.address_or_pr}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(invoice.address_or_pr, 'Dirección')}
                      className="glass-subtle border-glass-border"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {invoice.payment?.tx_hash && (
                  <div>
                    <p className="text-sm text-muted-foreground">Hash de transacción</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                        {invoice.payment.tx_hash}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(invoice.payment!.tx_hash, 'Hash')}
                        className="glass-subtle border-glass-border"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de creación</p>
                  <p className="font-mono">{invoice.created_at.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Fecha de expiración</p>
                  <p className="font-mono">{invoice.expires_at.toLocaleString()}</p>
                </div>

                {invoice.payment && (
                  <div>
                    <p className="text-sm text-muted-foreground">Monto recibido</p>
                    <p className="font-mono">{formatCryptoAmount(invoice.payment.amount_received, invoice.method)}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-20">
          <Button
            variant="outline"
            className="glass-subtle border-glass-border"
            onClick={() => copyToClipboard(invoice.payment_url, 'Enlace de pago')}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar enlace
          </Button>

          <Button
            variant="outline"
            className="glass-subtle border-glass-border"
            onClick={() => toast({ title: "Funcionalidad próximamente", description: "Reintentar webhook estará disponible pronto" })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar webhook
          </Button>

          {invoice.payment?.tx_hash && (
            <Button
              variant="outline"
              className="glass-subtle border-glass-border"
              onClick={() => {
                const explorerUrl = invoice.method === 'BTC_LN'
                  ? `https://mempool.space/tx/${invoice.payment!.tx_hash}`
                  : invoice.method === 'BTC'
                  ? `https://mempool.space/tx/${invoice.payment!.tx_hash}`
                  : `https://basescan.org/tx/${invoice.payment!.tx_hash}`;
                window.open(explorerUrl, '_blank');
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver en explorer
            </Button>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default InvoiceDetail;