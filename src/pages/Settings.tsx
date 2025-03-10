
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Bell, Lock, Eye, EyeOff, LogOut } from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [autoLogout, setAutoLogout] = useState(false);
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Settings Saved",
      description: "Your appearance settings have been updated.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy settings have been updated.",
    });
  };

  return (
    <AuthLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-muted-foreground" />
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <Button onClick={handleSaveAppearance}>Save Appearance Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive push notifications for important account activities
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive email notifications for important updates
                      </div>
                    </div>
                    <Switch
                      id="email-alerts"
                      checked={emailAlerts}
                      onCheckedChange={setEmailAlerts}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-balance">Show Balance</Label>
                      <div className="text-sm text-muted-foreground">
                        Display your account balance on the dashboard
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-balance"
                        checked={showBalance}
                        onCheckedChange={setShowBalance}
                      />
                      {showBalance ? <Eye className="h-5 w-5 text-muted-foreground" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-logout">Auto Logout</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically log out after 30 minutes of inactivity
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-logout"
                        checked={autoLogout}
                        onCheckedChange={setAutoLogout}
                      />
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
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
                
                <Button onClick={handleSavePrivacy}>Save Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthLayout>
  );
};

export default Settings;
