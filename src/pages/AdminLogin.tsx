import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Scale, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Tentative de connexion avec:", email);
      await login(email, password);
      console.log("Connexion réussie, redirection vers /admin");
      navigate("/admin");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      const errorMessage = err instanceof Error ? err.message : "Identifiants incorrects. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted" />
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1200px 700px at 10% 20%, hsl(var(--primary) / 0.16), transparent 40%), radial-gradient(900px 600px at 90% 80%, hsl(var(--accent) / 0.12), transparent 45%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="absolute -z-10 inset-0 pointer-events-none">
        <div
          className="absolute rounded-full blur-3xl opacity-70 [animation:axe-float-1_12s_ease-in-out_infinite] motion-reduce:[animation:none]"
          style={{
            width: 520,
            height: 520,
            left: "-10%",
            top: "-12%",
            background:
              "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.55), hsl(var(--primary) / 0.18))",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-70 [animation:axe-float-2_10s_ease-in-out_infinite] motion-reduce:[animation:none]"
          style={{
            width: 440,
            height: 440,
            right: "-8%",
            top: "8%",
            background:
              "radial-gradient(circle at 70% 35%, hsl(var(--primary) / 0.35), hsl(var(--primary) / 0.14))",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-65 [animation:axe-float-3_14s_ease-in-out_infinite] motion-reduce:[animation:none]"
          style={{
            width: 380,
            height: 380,
            left: "28%",
            bottom: "-14%",
            background:
              "radial-gradient(circle at 60% 60%, hsl(var(--accent) / 0.30), hsl(var(--accent) / 0.12))",
          }}
        />
      </div>

      <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-md border-white/60">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Connexion Admin</CardTitle>
          <CardDescription>Accès réservé aux administrateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@axe.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
