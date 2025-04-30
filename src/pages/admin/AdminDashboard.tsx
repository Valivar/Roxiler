
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Star } from "lucide-react";

const AdminDashboard = () => {
  const { users } = useAuth();
  const { stores, ratings } = useStore();

  // Count users by role
  const userCounts = {
    admin: users.filter(user => user.role === UserRole.ADMIN).length,
    storeOwner: users.filter(user => user.role === UserRole.STORE_OWNER).length,
    normal: users.filter(user => user.role === UserRole.NORMAL).length,
    total: users.length
  };

  // Get top rated stores
  const topStores = [...stores]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{userCounts.total}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {userCounts.admin} Admins • {userCounts.storeOwner} Store Owners • {userCounts.normal} Normal Users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stores
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Store className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{stores.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Registered on the platform
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{ratings.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Submitted by users
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top rated stores */}
      <h2 className="text-xl font-semibold mb-4">Top Rated Stores</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {topStores.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div className="truncate">{store.name}</div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{store.averageRating.toFixed(1)}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{store.address}</p>
              <p className="text-sm truncate">{store.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
