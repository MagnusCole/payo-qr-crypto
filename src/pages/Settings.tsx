import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PayoLogo } from '@/components/PayoLogo';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, TestTube, Wallet, Zap, Bitcoin, DollarSign, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PAYMENT_RULES } from '@/domain/rules';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    // Wallet addresses
    btcAddress: '',
    btcXpub: '',
    lnEndpoint: '',
    evmAddress: '',

    // Webhook configuration
    webhookUrl: '',
    webhookSecret: '',

    // Preferences
    defaultExpiryMin: 15,
    confTarget: 1,
    tolerancePct: 1
  });

  const handleSave = () => {
    // Simulate save
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido aplicados correctamente"
    });
  };

  const testWebhook = () => {
    // Simulate webhook test
    toast({
      title: "Webhook probado",
      description: "Evento de prueba enviado correctamente"
    });
  };

  return (
    <div className="min-h-screen p-4">
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
          <h1 className="text-2xl font-bold">Configuración</h1>
        </div>

        {/* Wallet Addresses */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Direcciones de destino
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configura donde recibirás los pagos para cada red
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                Dirección BTC on-chain
              </label>
              <Input
                value={settings.btcAddress}
                onChange={(e) => setSettings({ ...settings, btcAddress: e.target.value })}
                placeholder="bc1q..."
                className="glass-subtle border-glass-border font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                BTC xPub (opcional)
              </label>
              <Input
                value={settings.btcXpub}
                onChange={(e) => setSettings({ ...settings, btcXpub: e.target.value })}
                placeholder="xpub6D4BDPcP2GT577Vvch3R8wDkScZWz..."
                className="glass-subtle border-glass-border font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Para generar direcciones únicas por invoice
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                LN Endpoint
              </label>
              <Input
                value={settings.lnEndpoint}
                onChange={(e) => setSettings({ ...settings, lnEndpoint: e.target.value })}
                placeholder="node1234@lightning.example.com:9735"
                className="glass-subtle border-glass-border font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Dirección USDC (Base)
              </label>
              <Input
                value={settings.evmAddress}
                onChange={(e) => setSettings({ ...settings, evmAddress: e.target.value })}
                placeholder="0x742d35Cc6635C0532925a3b8D2F3ED3e9"
                className="glass-subtle border-glass-border font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle>Configuración de webhooks</CardTitle>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones automáticas cuando cambien los estados de pago
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL del webhook</label>
              <Input
                value={settings.webhookUrl}
                onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                placeholder="https://mystore.com/webhook/payo"
                className="glass-subtle border-glass-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secret del webhook</label>
              <Input
                value={settings.webhookSecret}
                onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })}
                placeholder="whsec_1234567890abcdef"
                className="glass-subtle border-glass-border font-mono"
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Se usa para verificar la autenticidad (HMAC SHA-256)
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={testWebhook}
                className="glass-subtle border-glass-border"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Probar webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="glass shadow-glow-subtle">
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiración por defecto</label>
                <Select
                  value={settings.defaultExpiryMin.toString()}
                  onValueChange={(value) => setSettings({ ...settings, defaultExpiryMin: parseInt(value) })}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmaciones requeridas</label>
                <Select
                  value={settings.confTarget.toString()}
                  onValueChange={(value) => setSettings({ ...settings, confTarget: parseInt(value) })}
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {PAYMENT_RULES.CONFIRMATION_OPTIONS.map((conf) => (
                      <SelectItem key={conf} value={conf.toString()}>
                        {conf} confirmación{conf > 1 ? 'es' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tolerancia de monto (%)</label>
                <Select
                  value={settings.tolerancePct.toString()}
                  onValueChange={(value) => setSettings({ ...settings, tolerancePct: parseInt(value) })}
                >
                  <SelectTrigger className="glass-subtle border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {PAYMENT_RULES.TOLERANCE_OPTIONS.map((pct) => (
                      <SelectItem key={pct} value={pct.toString()}>
                        {pct === 0 ? 'Exacto' : `±${pct}%`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Guide */}
        <Card className="glass shadow-glow-subtle border-primary/20">
          <CardHeader>
            <CardTitle>Guía de integración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Configura tu webhook URL</p>
                  <p className="text-sm text-muted-foreground">
                    Endpoint que recibirá las notificaciones de estado
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Implementa la verificación HMAC</p>
                  <p className="text-sm text-muted-foreground">
                    Valida que los eventos vienen realmente de Payo
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Maneja los eventos</p>
                  <p className="text-sm text-muted-foreground">
                    invoice.created, invoice.detected, invoice.confirmed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Importante</p>
                  <p className="text-xs text-muted-foreground">
                    Nunca expongas tu webhook secret. Úsalo solo en tu backend para verificar eventos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pb-20">
          <Button
            onClick={handleSave}
            variant="payo"
            className="shadow-lg hover:shadow-glow-primary transition-glow font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar configuración
          </Button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Settings;