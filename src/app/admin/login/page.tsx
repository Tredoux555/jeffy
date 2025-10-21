"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple authentication - in production, use proper auth
    if (username === "admin" && password === "jeffy2024") {
      localStorage.setItem("adminAuth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Admin Login
            </CardTitle>
            <p className="text-black">Access the admin dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Default credentials:</p>
              <p>Username: admin</p>
              <p>Password: jeffy2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


