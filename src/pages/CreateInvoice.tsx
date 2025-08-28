import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PayoLogo } from '@/components/PayoLogo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Bitcoin, DollarSign, QrCode, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    description: '',
    expiry: '15'
  });

  const [generatedInvoice, setGeneratedInvoice] = useState({
    id: 'inv_123456',
    qrCode: 'payo.app/pay/inv_123456',
    cryptoAmount: '0.00234',
    cryptoCurrency: 'BTC',
    address: 'lnbc1234567890...',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      setStep('result');
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Link copiado al portapapeles"
    });
  };

  const shareInvoice = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pago con Payo',
        text: `Pagar S/. ${formData.amount}`,
        url: `https://payo.app/pay/${generatedInvoice.id}`
      });
    } else {
      copyToClipboard(`https://payo.app/pay/${generatedInvoice.id}`);
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

  const getRateConversion = (amount: string, method: string) => {
    if (!amount) return '';
    const amountNum = parseFloat(amount);
    
    switch (method) {
      case 'lightning':
      case 'bitcoin':
        return `≈ ${(amountNum * 0.00234 / 150).toFixed(8)} BTC`;
      case 'usdc':
        return `≈ ${(amountNum / 3.75).toFixed(2)} USDC`;
      default:
        return '';
    }
  };

  if (step === 'result') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="glass" 
              size="icon"
              onClick={() => setStep('form')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <PayoLogo size="md" />
          </div>

          {/* QR Card */}
          <Card className="glass shadow-glow-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">¡Cobro generado!</CardTitle>
              <p className="text-muted-foreground">
                Comparte el QR o link para recibir el pago
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center">
                  <QrCode className="w-full h-full text-gray-800" />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">S/. {formData.amount}</p>
                  <p className="text-lg text-muted-foreground">
                    {generatedInvoice.cryptoAmount} {generatedInvoice.cryptoCurrency}
                  </p>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {formData.description}
                    </p>
                  )}
                </div>

                {/* Method Badge */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 bg-gradient-primary px-4 py-2 rounded-full">
                    {getMethodIcon(formData.method)}
                    <span className="text-primary-foreground font-medium capitalize">
                      {formData.method === 'lightning' ? 'Lightning' : 
                       formData.method === 'bitcoin' ? 'Bitcoin' : 'USDC Base'}
                    </span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Expira en {formData.expiry} minutos
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-gradient-primary h-2 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="payo" 
                  size="lg" 
                  className="w-full"
                  onClick={() => copyToClipboard(`https://payo.app/pay/${generatedInvoice.id}`)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
                
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="w-full"
                  onClick={shareInvoice}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>

              {/* Technical Details */}
              <div className="glass-subtle rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground">Dirección/Invoice:</p>
                <p className="text-xs font-mono break-all">{generatedInvoice.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button 
              variant="glass" 
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Ver Dashboard
            </Button>
            <Button 
              variant="payo-secondary" 
              className="flex-1"
              onClick={() => {
                setStep('form');
                setFormData({ amount: '', method: '', description: '', expiry: '15' });
              }}
            >
              Nuevo Cobro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="glass" 
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PayoLogo size="md" />
        </div>

        {/* Form Card */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Crear Cobro</CardTitle>
            <p className="text-center text-muted-foreground">
              Genera un QR y link para recibir pagos en cripto
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
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="pl-10 glass-subtle border-glass-border text-lg font-semibold"
                    required
                  />
                </div>
                {formData.amount && formData.method && (
                  <p className="text-sm text-muted-foreground">
                    {getRateConversion(formData.amount, formData.method)}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de pago</label>
                <Select 
                  value={formData.method} 
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                  required
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue placeholder="Selecciona una red" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    <SelectItem value="lightning">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Lightning Network
                      </div>
                    </SelectItem>
                    <SelectItem value="bitcoin">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-4 h-4" />
                        Bitcoin on-chain
                      </div>
                    </SelectItem>
                    <SelectItem value="usdc">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
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
                  placeholder="Consultoría web, diseño logo, etc."
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
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="1440">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                variant="payo" 
                size="lg" 
                className="w-full"
                disabled={!formData.amount || !formData.method}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generar QR
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-subtle">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Lightning: confirmación instantánea</span>
              </div>
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4 text-primary" />
                <span>Bitcoin: 1 confirmación requerida</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span>USDC Base: 3 bloques de confirmación</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;