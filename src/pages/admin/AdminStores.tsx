
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SortableTable from "@/components/SortableTable";
import StarRating from "@/components/StarRating";
import { Plus } from "lucide-react";

const AdminStores = () => {
  const { stores, addStore, loading } = useStore();
  const [open, setOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  const columns = [
    { key: "name", title: "Name", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { key: "address", title: "Address", sortable: true },
    { 
      key: "averageRating", 
      title: "Rating", 
      sortable: true,
      render: (store) => (
        <div className="flex items-center">
          <StarRating value={store.averageRating} readonly size="sm" />
          <span className="ml-2">{store.averageRating.toFixed(1)}</span>
        </div>
      )
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewStore({
      ...newStore,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStore = async () => {
    const result = await addStore(newStore);
    if (result) {
      setOpen(false);
      setNewStore({ name: "", email: "", address: "" });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stores</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>
      
      <SortableTable
        data={stores}
        columns={columns}
        initialSortField="name"
        filterFields={["name", "email", "address"]}
      />
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Store</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                name="name"
                value={newStore.name}
                onChange={handleInputChange}
                placeholder="Enter store name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newStore.email}
                onChange={handleInputChange}
                placeholder="Enter store email"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={newStore.address}
                onChange={handleInputChange}
                placeholder="Enter store address"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStore} disabled={loading}>
              {loading ? "Adding..." : "Add Store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStores;
