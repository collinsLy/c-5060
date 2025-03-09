
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const More = () => {
  return (
    <AuthLayout title="More Options">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/chart">
          <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <RefreshCw className="mr-2 h-5 w-5 text-primary" />
                Advanced Charts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Access detailed TradingView charts with advanced indicators and tools
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/affiliate">
          <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Affiliate Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Refer friends and earn commission on their trading volume
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/demo">
          <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                Demo Trading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Practice trading with virtual funds without risking real money
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Learning Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Educational resources, tutorials, and trading strategies
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Security Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Manage your account security, 2FA, and login settings
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <HelpCircle className="mr-2 h-5 w-5 text-primary" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Contact our support team, FAQs, and troubleshooting guides
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <UserCheck className="mr-2 h-5 w-5 text-primary" />
              Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Complete account verification to unlock higher withdrawal limits
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card h-full hover:bg-card/80 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Join our trading community, forums, and discussion groups
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default More;
