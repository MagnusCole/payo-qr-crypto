import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PayoLogo } from '@/components/PayoLogo';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Download, Filter, Copy, ExternalLink } from 'lucide-react';
import { useInvoices } from '@/store/usePayo';
import { InvoiceStatus, Method, InvoiceFilters } from '@/domain/types';
import { getStatusConfig, getCryptoConfig, formatPENAmount, formatCryptoAmount } from '@/domain/rules';
import { useToast } from '@/hooks/use-toast';

const Invoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState<InvoiceFilters>({});

  const { data: invoices, isLoading } = useInvoices(filters);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`
    });
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const config = getStatusConfig(status);
    return (
      <Badge variant={config.color as "success" | "warning" | "danger" | "secondary"} className="flex items-center gap-1">
        {config.label}
      </Badge>
    );
  };

  const getMethodBadge = (method: Method) => {
    const config = getCryptoConfig(method);
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm">{config.icon}</span>
        <span className="text-xs">{config.name}</span>
      </div>
    );
  };

  const handleFilterChange = (key: keyof InvoiceFilters, value: string | InvoiceStatus | Method | Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <PayoLogo size="lg" />
          <p className="text-muted-foreground">Cargando facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Filters */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="detected">Detectado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                    <SelectItem value="underpaid">Pago insuficiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Método</label>
                <Select
                  value={filters.method || 'all'}
                  onValueChange={(value) => handleFilterChange('method', value)}
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="BTC_LN">BTC Lightning</SelectItem>
                    <SelectItem value="BTC">BTC on-chain</SelectItem>
                    <SelectItem value="USDC_BASE">USDC (Base)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Exportar</label>
                <Button variant="glass" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle>Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            {!invoices || invoices.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Aún no tienes cobros</h3>
                  <p className="text-muted-foreground">
                    Crea tu primer link de pago para comenzar a recibir criptomonedas
                  </p>
                </div>
                <Button
                  variant="payo"
                  onClick={() => navigate('/new-invoice')}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer cobro
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 glass-subtle rounded-lg hover:shadow-glow-subtle transition-glow cursor-pointer"
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getMethodBadge(invoice.method)}
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div>
                        <p className="font-medium">{formatPENAmount(invoice.amount_pen)}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.description || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCryptoAmount(invoice.amount_crypto, invoice.method)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.created_at.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(invoice.payment_url, 'Link de pago');
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(invoice.payment_url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Invoices;
