
import PasswordChangeForm from "@/components/PasswordChangeForm";

const StoreOwnerSettings = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg border p-6">
        <PasswordChangeForm />
      </div>
    </div>
  );
};

export default StoreOwnerSettings;
