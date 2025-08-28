import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PayoLogo } from '@/components/PayoLogo';
import { useParams } from 'react-router-dom';
import { QrCode, Copy, CheckCircle, Clock, AlertCircle, Zap, Bitcoin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'pending' | 'detected' | 'confirmed' | 'expired'>('pending');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Mock invoice data
  const invoice = {
    id: invoiceId,
    amount: 150,
    currency: 'PEN',
    cryptoAmount: '0.00234',
    cryptoCurrency: 'BTC',
    method: 'lightning',
    description: 'Consultoría web',
    address: 'lnbc1234567890abcdef...',
    createdAt: new Date()
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate payment detection after 10 seconds for demo
    const paymentSimulation = setTimeout(() => {
      if (status === 'pending') {
        setStatus('detected');
        setTimeout(() => setStatus('confirmed'), 3000);
      }
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(paymentSimulation);
    };
  }, [status]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Dirección copiada al portapapeles"
    });
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

  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-8 h-8 text-warning" />,
          title: "Esperando tu pago...",
          description: "Abre tu wallet y escanea el QR o copia la dirección",
          bgClass: "border-warning/20"
        };
      case 'detected':
        return {
          icon: <AlertCircle className="w-8 h-8 text-secondary animate-pulse" />,
          title: "Pago recibido, confirmando...",
          description: "Tu pago ha sido detectado y está siendo confirmado",
          bgClass: "border-secondary/20"
        };
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-success" />,
          title: "✅ Pagado. ¡Gracias!",
          description: "Tu pago ha sido confirmado exitosamente",
          bgClass: "border-success/20"
        };
      case 'expired':
        return {
          icon: <AlertCircle className="w-8 h-8 text-danger" />,
          title: "Este cobro ha expirado",
          description: "Solicita un nuevo link de pago al comercio",
          bgClass: "border-danger/20"
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  if (status === 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <PayoLogo size="lg" />
          </div>
          
          <Card className={`glass shadow-glow-primary ${statusDisplay.bgClass}`}>
            <CardContent className="pt-8 text-center space-y-6">
              <div className="space-y-4">
                {statusDisplay.icon}
                <div>
                  <h1 className="text-2xl font-bold mb-2">{statusDisplay.title}</h1>
                  <p className="text-muted-foreground">{statusDisplay.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-3xl font-bold">S/. {invoice.amount}</p>
                <p className="text-lg text-muted-foreground">
                  {invoice.cryptoAmount} {invoice.cryptoCurrency}
                </p>
                {invoice.description && (
                  <p className="text-sm text-muted-foreground">{invoice.description}</p>
                )}
              </div>

              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <PayoLogo size="lg" />
        </div>
        
        <Card className={`glass shadow-glow-subtle ${statusDisplay.bgClass}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {statusDisplay.icon}
            </div>
            <CardTitle className="text-xl">{statusDisplay.title}</CardTitle>
            <p className="text-muted-foreground">{statusDisplay.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Payment Amount */}
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold">S/. {invoice.amount}</p>
              <p className="text-lg text-muted-foreground">
                {invoice.cryptoAmount} {invoice.cryptoCurrency}
              </p>
              {invoice.description && (
                <p className="text-sm text-muted-foreground">{invoice.description}</p>
              )}
            </div>

            {/* Method Badge */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-gradient-primary px-4 py-2 rounded-full">
                {getMethodIcon(invoice.method)}
                <span className="text-primary-foreground font-medium capitalize">
                  {invoice.method === 'lightning' ? 'Lightning' : 
                   invoice.method === 'bitcoin' ? 'Bitcoin' : 'USDC Base'}
                </span>
              </div>
            </div>

            {status !== 'expired' && (
              <>
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center">
                    <QrCode className="w-full h-full text-gray-800" />
                  </div>
                </div>

                {/* Copy Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {invoice.method === 'lightning' ? 'Invoice Lightning' : 'Dirección'}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 glass-subtle rounded-lg p-3">
                      <p className="text-xs font-mono break-all">{invoice.address}</p>
                    </div>
                    <Button 
                      variant="glass" 
                      size="icon"
                      onClick={() => copyToClipboard(invoice.address)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Timer */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Tiempo restante</p>
                  <p className="text-2xl font-bold text-warning">{formatTime(timeLeft)}</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}

            {/* Payment Instructions */}
            <div className="glass-subtle rounded-lg p-4">
              <p className="text-sm text-center text-muted-foreground">
                {status === 'expired' 
                  ? 'Solicita un nuevo link de pago para continuar'
                  : status === 'detected'
                  ? 'Confirmando tu pago en la blockchain...'
                  : 'Escanea el QR con tu wallet o copia la dirección para pagar'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Powered by Payo */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent font-medium">
              Payo
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;