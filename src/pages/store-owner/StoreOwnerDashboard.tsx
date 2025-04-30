
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SortableTable from "@/components/SortableTable";
import StarRating from "@/components/StarRating";
import { Star, Users } from "lucide-react";

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const { stores, ratings, getUsersWhoRatedStore } = useStore();
  
  if (!user || !user.storeId) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">No store assigned</h1>
        <p className="text-muted-foreground">
          You don't have any store assigned to your account yet.
          Please contact an administrator to assign you to a store.
        </p>
      </div>
    );
  }

  // Get the owner's store
  const store = stores.find(s => s.id === user.storeId);
  
  if (!store) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Store not found</h1>
        <p className="text-muted-foreground">
          The store assigned to your account could not be found.
          Please contact an administrator.
        </p>
      </div>
    );
  }
  
  // Get users who rated the store
  const usersWhoRated = getUsersWhoRatedStore(store.id);
  
  // Get ratings for this store
  const storeRatings = ratings.filter(r => r.storeId === store.id);
  
  // Calculate stats
  const ratingCounts = storeRatings.reduce((acc, rating) => {
    acc[rating.value] = (acc[rating.value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const columns = [
    { key: "name", title: "Name", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { 
      key: "rating", 
      title: "Rating", 
      sortable: true,
      render: (user) => {
        const rating = ratings.find(r => r.userId === user.id && r.storeId === store.id);
        return (
          <div className="flex items-center">
            <StarRating value={rating?.value || 0} readonly size="sm" />
            <span className="ml-2">{rating?.value || 0}</span>
          </div>
        );
      }
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
      
      <div className="mb-8 bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-2">{store.name}</h2>
        <p className="text-muted-foreground">{store.address}</p>
        <p className="text-sm">{store.email}</p>
        
        <div className="flex items-center mt-4">
          <StarRating value={store.averageRating} readonly />
          <span className="ml-2 text-lg font-medium">{store.averageRating.toFixed(1)}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-12 flex items-center">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 ml-1" fill="#f59e0b" />
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full ml-2">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{
                        width: `${(ratingCounts[rating] || 0) / storeRatings.length * 100 || 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-sm text-muted-foreground">
                    {ratingCounts[rating] || 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ratings Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{store.averageRating.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{storeRatings.length}</div>
                <div className="text-xs text-muted-foreground">Total Ratings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{usersWhoRated.length}</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">
                {usersWhoRated.length} users have rated your store
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Users Who Rated Your Store</h2>
      <SortableTable
        data={usersWhoRated}
        columns={columns}
        initialSortField="name"
      />
    </div>
  );
};

export default StoreOwnerDashboard;
