import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PayoLogo } from '@/components/PayoLogo';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Copy, Share } from 'lucide-react';
import { useCreateInvoice } from '@/store/usePayo';
import { CreateInvoiceRequest, Method } from '@/domain/types';
import { PAYMENT_RULES, getCryptoConfig, formatCryptoAmount, formatPENAmount } from '@/domain/rules';
import { useToast } from '@/hooks/use-toast';

const NewInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createInvoiceMutation = useCreateInvoice();

  const [formData, setFormData] = useState<CreateInvoiceRequest & { expiry: string }>({
    amount_pen: 0,
    method: '' as Method,
    description: '',
    expiry: '15'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount_pen || !formData.method) return;

    try {
      const result = await createInvoiceMutation.mutateAsync({
        amount_pen: formData.amount_pen,
        method: formData.method,
        description: formData.description
      });

      // Navigate to the payment page with the created invoice
      navigate(`/pay/${result.invoice_id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la factura. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`
    });
  };

  const getRateConversion = (amount: number, method: Method) => {
    if (!amount || !method) return '';

    // Mock conversion rates (replace with real price feed)
    const rates = {
      BTC_LN: 0.00234 / 150, // BTC per PEN
      BTC: 0.00234 / 150,
      USDC_BASE: 1 / 3.75 // USDC per PEN
    };

    const rate = rates[method];
    const cryptoAmount = amount * rate;

    switch (method) {
      case 'BTC_LN':
      case 'BTC':
        return `≈ ${cryptoAmount.toFixed(8)} BTC`;
      case 'USDC_BASE':
        return `≈ ${cryptoAmount.toFixed(2)} USDC`;
      default:
        return '';
    }
  };

  const getMethodIcon = (method: Method) => {
    const config = getCryptoConfig(method);
    return <span className="text-lg">{config.icon}</span>;
  };

  const getMethodName = (method: Method) => {
    const config = getCryptoConfig(method);
    return config.name;
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="glass"
            size="icon"
            onClick={() => navigate('/invoices')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PayoLogo size="md" />
        </div>

        {/* Form Card */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Nuevo Cobro</CardTitle>
            <p className="text-center text-muted-foreground">
              Genera un link/QR para cobrar en BTC o USDC
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Monto en PEN</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    S/.
                  </span>
                  <Input
                    type="number"
                    placeholder="150.00"
                    value={formData.amount_pen || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      amount_pen: parseFloat(e.target.value) || 0
                    })}
                    className="pl-10 glass-subtle border-glass-border text-lg font-semibold"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                {formData.amount_pen > 0 && formData.method && (
                  <p className="text-sm text-muted-foreground">
                    {getRateConversion(formData.amount_pen, formData.method)}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de pago</label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value as Method })}
                  required
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue placeholder="Selecciona una red" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    <SelectItem value="BTC_LN">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        BTC Lightning
                      </div>
                    </SelectItem>
                    <SelectItem value="BTC">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">₿</span>
                        BTC on-chain
                      </div>
                    </SelectItem>
                    <SelectItem value="USDC_BASE">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">◊</span>
                        USDC (Base)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción (opcional)</label>
                <Textarea
                  placeholder="Servicio de diseño, consultoría, producto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass-subtle border-glass-border"
                  rows={3}
                />
              </div>

              {/* Expiry */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiración</label>
                <Select
                  value={formData.expiry}
                  onValueChange={(value) => setFormData({ ...formData, expiry: value })}
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {PAYMENT_RULES.EXPIRATION_OPTIONS.map((minutes) => (
                      <SelectItem key={minutes} value={minutes.toString()}>
                        {minutes < 60 ? `${minutes} minutos` : `${minutes / 60} hora${minutes > 60 ? 's' : ''}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="payo"
                size="lg"
                className="w-full"
                disabled={!formData.amount_pen || !formData.method || createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? (
                  <>Creando...</>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generar Link de Pago
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-subtle">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span>Lightning: confirmación instantánea</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">₿</span>
                <span>Bitcoin: 1 confirmación requerida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">◊</span>
                <span>USDC Base: 3 bloques de confirmación</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default NewInvoice;
