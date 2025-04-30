
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SortableTable from "@/components/SortableTable";
import { Plus, Store, User } from "lucide-react";

const AdminUsers = () => {
  const { users, addUser, loading } = useAuth();
  const { stores } = useStore();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.NORMAL);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const columns = [
    { key: "name", title: "Name", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { key: "address", title: "Address", sortable: true },
    { 
      key: "role", 
      title: "Role", 
      sortable: true,
      render: (user) => (
        <div className="flex items-center">
          {user.role === UserRole.ADMIN && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Admin
            </span>
          )}
          {user.role === UserRole.STORE_OWNER && (
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Store className="h-3 w-3 mr-1" />
              Store Owner
            </span>
          )}
          {user.role === UserRole.NORMAL && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <User className="h-3 w-3 mr-1" />
              Normal User
            </span>
          )}
        </div>
      )
    },
  ];

  // Filter out admin and store owners (show all users)
  const filteredUsers = users;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async () => {
    const userData = {
      ...newUser,
      role: selectedRole,
      storeId: selectedRole === UserRole.STORE_OWNER ? selectedStore : undefined
    };
    
    const result = await addUser(userData);
    if (result) {
      setOpen(false);
      setNewUser({ name: "", email: "", password: "", address: "" });
      setSelectedRole(UserRole.NORMAL);
      setSelectedStore("");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <SortableTable
        data={filteredUsers}
        columns={columns}
        initialSortField="name"
        filterFields={["name", "email", "address", "role"]}
      />
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
              <p className="text-xs text-muted-foreground mt-1">
                8-16 characters, one uppercase letter, one special character
              </p>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                  <SelectItem value={UserRole.STORE_OWNER}>Store Owner</SelectItem>
                  <SelectItem value={UserRole.NORMAL}>Normal User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedRole === UserRole.STORE_OWNER && (
              <div>
                <Label htmlFor="store">Assign Store</Label>
                <Select
                  value={selectedStore}
                  onValueChange={setSelectedStore}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
