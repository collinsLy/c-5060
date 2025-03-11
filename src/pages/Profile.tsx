
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { username, setUsername } = useUser();
  const [name, setName] = useState(username);
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the username in the context
    setUsername(name);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been saved.",
    });
  };

  return (
    <AuthLayout title="Profile">
      <div className="space-y-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-fa">Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Switch
                    id="two-fa"
                    checked={twoFAEnabled}
                    onCheckedChange={setTwoFAEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email notifications for important account activities
                    </div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <Button type="submit">Update Security Settings</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default Profile;
