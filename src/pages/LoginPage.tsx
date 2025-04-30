
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { LoginCredentials, UserRole } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    // Explicitly cast the form values to LoginCredentials since we know they're validated
    const credentials: LoginCredentials = {
      email: values.email,
      password: values.password,
    };
    const success = await login(credentials);
    
    if (success) {
      // Get the current user from localStorage to determine role-based navigation
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        
        // Redirect based on user role
        switch (currentUser.role) {
          case UserRole.ADMIN:
            navigate("/admin");
            break;
          case UserRole.STORE_OWNER:
            navigate("/store-owner");
            break;
          case UserRole.NORMAL:
            navigate("/stores");
            break;
          default:
            navigate("/stores"); // Default fallback
        }
      } else {
        // Fallback if no user data found (shouldn't happen)
        navigate("/stores");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Score-It System</h1>
          <p className="text-muted-foreground mt-2">Log in to manage your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 mb-4 rounded border border-red-200">
                {error}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Register
                </Link>
              </p>
            </div>

            <div className="mt-8 border-t pt-4">
              <p className="text-sm text-center text-muted-foreground mb-2">Demo accounts:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="border rounded p-2">
                  <p className="font-bold">Admin</p>
                  <p>admin@example.com</p>
                  <p>Admin@123</p>
                </div>
                <div className="border rounded p-2">
                  <p className="font-bold">Store Owner</p>
                  <p>storeowner@example.com</p>
                  <p>Store@123</p>
                </div>
                <div className="border rounded p-2">
                  <p className="font-bold">Normal User</p>
                  <p>user@example.com</p>
                  <p>User@123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
