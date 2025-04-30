
import { createContext, useContext, useState } from "react";
import { Store, Rating, User, UserRole } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Mock stores for demonstration
const mockStores: Store[] = [
  {
    id: "1",
    name: "Coffee Haven",
    email: "info@coffeehaven.com",
    address: "123 Coffee Street, Brewville",
    ownerId: "2", // Store owner user ID
    averageRating: 4.2,
  },
  {
    id: "2",
    name: "Tech Gadgets Store",
    email: "support@techgadgets.com",
    address: "456 Technology Avenue, Techville",
    ownerId: "4", // This owner doesn't exist in our mock users yet
    averageRating: 3.8,
  },
  {
    id: "3",
    name: "Fresh Grocery Market",
    email: "hello@freshmarket.com",
    address: "789 Fresh Road, Vegetaville",
    ownerId: "5", // This owner doesn't exist in our mock users yet
    averageRating: 4.5,
  }
];

// Mock ratings for demonstration
const mockRatings: Rating[] = [
  {
    id: "1",
    storeId: "1",
    userId: "3", // Jane Smith, normal user
    value: 4,
    userName: "Jane Smith Regular User"
  },
  {
    id: "2",
    storeId: "2",
    userId: "3", // Jane Smith, normal user
    value: 3,
    userName: "Jane Smith Regular User"
  },
  {
    id: "3",
    storeId: "3",
    userId: "3", // Jane Smith, normal user
    value: 5,
    userName: "Jane Smith Regular User"
  }
];

interface StoreContextType {
  stores: Store[];
  ratings: Rating[];
  getUserRating: (userId: string, storeId: string) => Rating | undefined;
  submitRating: (userId: string, storeId: string, value: number) => Promise<boolean>;
  addStore: (storeData: { name: string, email: string, address: string }) => Promise<boolean>;
  getStoresByOwner: (ownerId: string) => Store[];
  getUsersWhoRatedStore: (storeId: string) => User[];
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);
  const [loading, setLoading] = useState(false);
  const { users } = useAuth();

  const calculateAverageRating = (storeId: string) => {
    const storeRatings = ratings.filter(rating => rating.storeId === storeId);
    if (storeRatings.length === 0) return 0;
    
    const sum = storeRatings.reduce((acc, curr) => acc + curr.value, 0);
    return parseFloat((sum / storeRatings.length).toFixed(1));
  };

  const getUserRating = (userId: string, storeId: string) => {
    return ratings.find(rating => rating.userId === userId && rating.storeId === storeId);
  };

  const submitRating = async (userId: string, storeId: string, value: number): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find the user
      const user = users.find(u => u.id === userId);
      if (!user) {
        toast.error("User not found");
        return false;
      }

      // Check if the user has already rated this store
      const existingRatingIndex = ratings.findIndex(r => r.userId === userId && r.storeId === storeId);

      if (existingRatingIndex !== -1) {
        // Update existing rating
        const updatedRatings = [...ratings];
        updatedRatings[existingRatingIndex] = {
          ...updatedRatings[existingRatingIndex],
          value
        };
        setRatings(updatedRatings);
      } else {
        // Create new rating
        const newRating: Rating = {
          id: String(ratings.length + 1),
          storeId,
          userId,
          value,
          userName: user.name
        };
        setRatings([...ratings, newRating]);
      }

      // Update store average rating
      const updatedStores = stores.map(store => {
        if (store.id === storeId) {
          return {
            ...store,
            averageRating: calculateAverageRating(storeId)
          };
        }
        return store;
      });
      setStores(updatedStores);

      toast.success("Rating submitted successfully");
      return true;
    } catch (error) {
      console.error("Rating submission error:", error);
      toast.error("An error occurred while submitting your rating");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addStore = async (storeData: { name: string, email: string, address: string }): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if store with same email already exists
      if (stores.some(s => s.email === storeData.email)) {
        toast.error("A store with this email already exists");
        return false;
      }

      // Create new store
      const newStore: Store = {
        id: String(stores.length + 1),
        name: storeData.name,
        email: storeData.email,
        address: storeData.address,
        ownerId: "0", // Placeholder, will be updated when store owner is assigned
        averageRating: 0
      };

      setStores([...stores, newStore]);
      toast.success("Store added successfully");
      return true;
    } catch (error) {
      console.error("Add store error:", error);
      toast.error("An error occurred while adding the store");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getStoresByOwner = (ownerId: string) => {
    return stores.filter(store => store.ownerId === ownerId);
  };

  const getUsersWhoRatedStore = (storeId: string) => {
    const userIds = ratings
      .filter(rating => rating.storeId === storeId)
      .map(rating => rating.userId);
    
    return users.filter(user => userIds.includes(user.id));
  };

  return (
    <StoreContext.Provider value={{ 
      stores, 
      ratings, 
      getUserRating, 
      submitRating, 
      addStore,
      getStoresByOwner,
      getUsersWhoRatedStore,
      loading 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
