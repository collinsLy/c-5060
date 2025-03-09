
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction, useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

const TransactionList = () => {
  const { transactions } = useUser();

  // Get the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  const formatTimestamp = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="flex items-center gap-2">
                    {transaction.type === "DEPOSIT" ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                          <ArrowDown className="w-4 h-4 text-success" />
                        </div>
                        <span>Deposit</span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                          <ArrowUp className="w-4 h-4 text-warning" />
                        </div>
                        <span>Withdrawal</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium">
                      {transaction.type === "DEPOSIT" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "COMPLETED"
                          ? "bg-success/20 text-success"
                          : transaction.status === "PENDING"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatTimestamp(transaction.timestamp)}
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

export default TransactionList;
