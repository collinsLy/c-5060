
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { ArrowRight } from "lucide-react";

const BalanceCard = () => {
  const { balance } = useUser();

  return (
    <Card className="bg-primary text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="text-white/80 font-medium">Current Balance</h3>
          <p className="text-4xl font-bold">$ {balance.toFixed(2)}</p>
          <a 
            href="/transactions" 
            className="inline-flex items-center gap-1 text-white/80 text-sm hover:text-white transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
