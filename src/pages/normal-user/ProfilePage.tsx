
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import PasswordChangeForm from "@/components/PasswordChangeForm";

const ProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Full Name</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email Address</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">User Role</dt>
                <dd className="font-medium">
                  {UserRole[user.role].replace('_', ' ')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Address</dt>
                <dd className="font-medium whitespace-pre-line">{user.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
