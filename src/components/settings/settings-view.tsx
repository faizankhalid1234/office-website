"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, User, Shield, ExternalLink, Users } from "lucide-react";
import { CompanyLogo } from "@/components/brand/company-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface SettingsViewProps {
  user: { name: string; email: string; role: string };
  companyName: string;
  djangoAdminUrl?: string;
}

export function SettingsView({ user, companyName, djangoAdminUrl }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Company</CardTitle>
          <CardDescription>Organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CompanyLogo size="lg" subtitle="Expense Manager" />
          <div>
            <p className="text-sm text-muted-foreground">Company Name</p>
            <p className="font-semibold">{companyName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Application</p>
            <p className="font-semibold">Office Expense Management System</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              {user.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {user.role === "ADMIN" && djangoAdminUrl && (
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Django Admin Panel
            </CardTitle>
            <CardDescription>
              Manage all users, emails, passwords &amp; roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
              <p><span className="text-muted-foreground">URL:</span> {djangoAdminUrl}</p>
              <p><span className="text-muted-foreground">Email:</span> admin@hhhusain.com</p>
              <p><span className="text-muted-foreground">Password:</span> admin123</p>
            </div>
            <a
              href={djangoAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              <ExternalLink className="h-4 w-4" />
              Open Django Admin Panel
            </a>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-4 w-4" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="pwa">Install as App (PWA)</Label>
            <p className="text-xs text-muted-foreground">
              Use browser menu → &quot;Install app&quot; on mobile/desktop
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
