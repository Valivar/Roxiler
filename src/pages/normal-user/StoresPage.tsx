
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { Search } from "lucide-react";

const StoresPage = () => {
  const { user } = useAuth();
  const { stores, getUserRating, submitRating, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  
  if (!user) return null;

  const handleRatingChange = (storeId: string, value: number) => {
    setRatings({
      ...ratings,
      [storeId]: value,
    });
  };

  const handleSubmitRating = async (storeId: string) => {
    if (!ratings[storeId]) return;
    
    await submitRating(user.id, storeId, ratings[storeId]);
  };

  // Filter stores based on search term
  const filteredStores = stores.filter((store) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(searchValue) ||
      store.address.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Browse Stores</h1>
      
      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/2"
        />
      </div>
      
      {/* Stores grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => {
            const userRating = getUserRating(user.id, store.id);
            const currentRating = ratings[store.id] || userRating?.value || 0;
            
            return (
              <Card key={store.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="truncate">{store.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 h-12 line-clamp-2">
                    {store.address}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Overall Rating:</div>
                      <div className="flex items-center">
                        <StarRating value={store.averageRating} readonly size="sm" />
                        <span className="ml-2 text-sm font-medium">
                          {store.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Your Rating:</div>
                      <StarRating
                        value={currentRating}
                        onChange={(value) => handleRatingChange(store.id, value)}
                        size="sm"
                      />
                    </div>
                    
                    <Button
                      onClick={() => handleSubmitRating(store.id)}
                      disabled={loading || !ratings[store.id]}
                      className="w-full"
                    >
                      {userRating ? "Update Rating" : "Submit Rating"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium mb-2">No stores found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresPage;
