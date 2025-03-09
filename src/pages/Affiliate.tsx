
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

const Affiliate = () => {
  const { username } = useUser();
  const referralCode = `VERTEX-${username}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const referralLink = `https://vertex-trading.com/ref/${referralCode}`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  return (
    <AuthLayout title="Affiliate Program">
      <div className="space-y-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <p className="text-muted-foreground">
                Share your unique referral link with friends and earn 10% commission on their trading volume!
              </p>
              <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full bg-transparent border-none focus:outline-none"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(referralLink, "Referral link copied to clipboard")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button 
                  className="flex-1"
                  onClick={() => copyToClipboard(referralLink, "Referral link copied to clipboard")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Join Vertex Trading',
                        text: 'Check out Vertex Trading for cryptocurrency trading!',
                        url: referralLink,
                      })
                      .catch(() => {
                        copyToClipboard(referralLink, "Referral link copied to clipboard");
                      });
                    } else {
                      copyToClipboard(referralLink, "Referral link copied to clipboard");
                    }
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-4xl font-bold">0</p>
                <p className="text-muted-foreground mt-2">Total Referrals</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-4xl font-bold">$0.00</p>
                <p className="text-muted-foreground mt-2">Total Commission</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">1</div>
                <div>
                  <h3 className="font-medium">Share Your Link</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Share your unique referral link with friends, family, or followers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">2</div>
                <div>
                  <h3 className="font-medium">They Sign Up</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    When someone clicks your link and creates an account, they're linked to you forever.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">3</div>
                <div>
                  <h3 className="font-medium">Earn Commissions</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Earn 10% commission on all their trading volume, paid directly to your account.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default Affiliate;
