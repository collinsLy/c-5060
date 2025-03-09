
import AuthLayout from "@/components/layout/AuthLayout";
import BalanceCard from "@/components/dashboard/BalanceCard";
import ActionGrid from "@/components/dashboard/ActionGrid";
import TransactionList from "@/components/dashboard/TransactionList";
import TradeHistoryList from "@/components/dashboard/TradeHistoryList";

const Dashboard = () => {
  return (
    <AuthLayout title="Dashboard">
      <div className="space-y-8">
        <BalanceCard />
        
        <ActionGrid />
        
        <div className="grid gap-8 md:grid-cols-2">
          <TransactionList />
          <TradeHistoryList />
        </div>
      </div>
    </AuthLayout>
  );
};

export default Dashboard;
