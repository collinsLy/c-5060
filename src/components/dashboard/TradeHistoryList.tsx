
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TradeHistory, useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

const TradeHistoryList = () => {
  const { tradeHistory } = useUser();

  // Get the 5 most recent trades
  const recentTrades = tradeHistory.slice(0, 5);

  const formatTimestamp = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTrades.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No trades yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>Stake</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>
                    <span className="font-medium">{trade.pair}</span>
                    <div className="text-xs text-muted-foreground">
                      {trade.market === "RISE_FALL" ? "Rise & Fall" : "Even/Odd"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium">
                      ${trade.stake.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium">
                      {trade.result === "WIN" 
                        ? `+$${trade.profit.toFixed(2)}` 
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {trade.result === "WIN" ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-success">Win</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-error" />
                        <span className="text-error">Loss</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatTimestamp(trade.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeHistoryList;
