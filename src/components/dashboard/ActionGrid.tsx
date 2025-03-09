
import {
  Wallet,
  Download,
  Bot,
  BarChart2,
  Users,
  Medal,
  Banknote,
  MoreHorizontal,
} from "lucide-react";
import DashboardActionButton from "./DashboardActionButton";
import { useState } from "react";
import DepositModal from "../modals/DepositModal";
import WithdrawModal from "../modals/WithdrawModal";
import { useNavigate } from "react-router-dom";

const ActionGrid = () => {
  const navigate = useNavigate();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <DashboardActionButton
        icon={<Wallet className="w-6 h-6" />}
        label="Deposit"
        onClick={() => setDepositModalOpen(true)}
      />
      <DashboardActionButton
        icon={<Download className="w-6 h-6" />}
        label="Withdraw"
        onClick={() => setWithdrawModalOpen(true)}
      />
      <DashboardActionButton
        icon={<Bot className="w-6 h-6" />}
        label="Run Bots"
        onClick={() => navigate("/bots")}
      />
      <DashboardActionButton
        icon={<BarChart2 className="w-6 h-6" />}
        label="Trade"
        onClick={() => navigate("/trade")}
      />
      <DashboardActionButton
        icon={<Users className="w-6 h-6" />}
        label="Affiliate"
        onClick={() => navigate("/affiliate")}
      />
      <DashboardActionButton
        icon={<Medal className="w-6 h-6" />}
        label="Chart"
        onClick={() => navigate("/chart")}
      />
      <DashboardActionButton
        icon={<Banknote className="w-6 h-6" />}
        label="Demo"
        onClick={() => navigate("/demo")}
      />
      <DashboardActionButton
        icon={<MoreHorizontal className="w-6 h-6" />}
        label="More"
        onClick={() => {}}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
      />
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />
    </div>
  );
};

export default ActionGrid;
