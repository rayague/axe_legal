import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

export default function UnderDevelopment({ title, description }: UnderDevelopmentProps) {
  return (
    <div className="p-8">
      <Card className="p-12 text-center">
        <Construction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">
          {description || "Cette fonctionnalité est en cours de développement"}
        </p>
        <p className="text-sm text-muted-foreground">
          Elle sera disponible prochainement
        </p>
      </Card>
    </div>
  );
}
