
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Transactions = () => {
  const { transactions, tradeHistory } = useUser();
  const [filter, setFilter] = useState("");
  
  // Combine transactions and trade history into a single array for the full history
  const allTransactions = [
    ...transactions.map(tx => ({
      id: tx.id,
      timestamp: new Date(tx.timestamp),
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      details: tx.details || "-",
      isTradeHistory: false
    })),
    ...tradeHistory.map(trade => ({
      id: trade.id,
      timestamp: new Date(trade.timestamp),
      type: trade.result === "WIN" ? "TRADE_WIN" : "TRADE_LOSS",
      amount: trade.result === "WIN" ? trade.profit : trade.stake,
      status: "COMPLETED",
      details: `${trade.pair} (${trade.market === "RISE_FALL" ? "Rise & Fall" : "Even/Odd"})`,
      isTradeHistory: true
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Filter transactions based on search input
  const filteredTransactions = filter
    ? allTransactions.filter(tx => 
        tx.details.toLowerCase().includes(filter.toLowerCase()) ||
        tx.type.toLowerCase().includes(filter.toLowerCase()) ||
        tx.status.toLowerCase().includes(filter.toLowerCase()) ||
        format(tx.timestamp, "PPpp").toLowerCase().includes(filter.toLowerCase())
      )
    : allTransactions;

  return (
    <AuthLayout title="Transaction History">
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Transactions</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 bg-background/50"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filter ? "No matching transactions found" : "No transactions yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="flex items-center gap-2">
                        {tx.type === "DEPOSIT" ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                              <ArrowDown className="w-4 h-4 text-success" />
                            </div>
                            <span>Deposit</span>
                          </>
                        ) : tx.type === "WITHDRAWAL" ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                              <ArrowUp className="w-4 h-4 text-warning" />
                            </div>
                            <span>Withdrawal</span>
                          </>
                        ) : tx.type === "TRADE_WIN" ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                              <ArrowDown className="w-4 h-4 text-success" />
                            </div>
                            <span>Trade Win</span>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                              <ArrowUp className="w-4 h-4 text-error" />
                            </div>
                            <span>Trade Loss</span>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-medium">
                          {tx.type === "DEPOSIT" || tx.type === "TRADE_WIN" ? "+" : "-"}$
                          {tx.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === "COMPLETED"
                              ? "bg-success/20 text-success"
                              : tx.status === "PENDING"
                              ? "bg-warning/20 text-warning"
                              : "bg-error/20 text-error"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell>{tx.details}</TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {format(tx.timestamp, "PPpp")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Transactions;
