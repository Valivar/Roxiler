
import { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, RegisterData, UserRole } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@example.com",
    address: "123 Admin Street, City",
    role: UserRole.ADMIN,
  },
  {
    id: "2",
    name: "John Doe Store Owner",
    email: "storeowner@example.com",
    address: "456 Store Avenue, City",
    role: UserRole.STORE_OWNER,
    storeId: "1",
  },
  {
    id: "3",
    name: "Jane Smith Regular User",
    email: "user@example.com",
    address: "789 User Road, City",
    role: UserRole.NORMAL,
  },
];

// Mock passwords (in a real app, this would be stored securely in a backend)
const mockPasswords: Record<string, string> = {
  "admin@example.com": "Admin@123",
  "storeowner@example.com": "Store@123",
  "user@example.com": "User@123",
};

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  addUser: (userData: RegisterData & { role: UserRole, storeId?: string }) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user in localStorage on initial load
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the user with the provided email
      const foundUser = users.find(u => u.email === credentials.email);
      
      // Check if user exists and password matches
      if (foundUser && mockPasswords[credentials.email] === credentials.password) {
        setUser(foundUser);
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (users.some(u => u.email === data.email)) {
        toast.error("Email already in use");
        return false;
      }

      // Validate password
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,16})$/;
      if (!passwordRegex.test(data.password)) {
        toast.error("Password must be 8-16 characters and include at least one uppercase letter and one special character");
        return false;
      }

      // Create new user
      const newUser: User = {
        id: String(users.length + 1),
        name: data.name,
        email: data.email,
        address: data.address,
        role: UserRole.NORMAL, // Default role for signup
      };

      // Update users array and mock passwords
      setUsers(prevUsers => [...prevUsers, newUser]);
      mockPasswords[data.email] = data.password;
      
      toast.success("Registration successful! Please log in.");
      navigate("/login");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast.success("You have been logged out");
    navigate("/login");
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if old password is correct
      if (mockPasswords[user.email] !== oldPassword) {
        toast.error("Current password is incorrect");
        return false;
      }

      // Validate new password
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,16})$/;
      if (!passwordRegex.test(newPassword)) {
        toast.error("Password must be 8-16 characters and include at least one uppercase letter and one special character");
        return false;
      }

      // Update password
      mockPasswords[user.email] = newPassword;
      
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("An error occurred while updating password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: RegisterData & { role: UserRole, storeId?: string }): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        toast.error("Email already in use");
        return false;
      }

      // Validate password
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,16})$/;
      if (!passwordRegex.test(userData.password)) {
        toast.error("Password must be 8-16 characters and include at least one uppercase letter and one special character");
        return false;
      }

      // Create new user
      const newUser: User = {
        id: String(users.length + 1),
        name: userData.name,
        email: userData.email,
        address: userData.address,
        role: userData.role,
        storeId: userData.storeId,
      };

      // Update users array and mock passwords
      setUsers(prevUsers => [...prevUsers, newUser]);
      mockPasswords[userData.email] = userData.password;
      
      toast.success(`${userData.role === UserRole.STORE_OWNER ? 'Store owner' : 'User'} added successfully`);
      return true;
    } catch (error) {
      console.error("Add user error:", error);
      toast.error("An error occurred while adding user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      register, 
      logout, 
      updatePassword, 
      addUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
