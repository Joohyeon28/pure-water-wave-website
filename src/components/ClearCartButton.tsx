import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

interface ClearCartButtonProps {
  label?: string;
}

const ClearCartButton = ({ label = "Clear cart" }: ClearCartButtonProps) => {
  const { itemCount, clear } = useCart();

  const handleClear = () => {
    clear();
    toast.success("Cart cleared");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          disabled={itemCount === 0}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear the cart?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes all {itemCount} item{itemCount === 1 ? "" : "s"} from your order. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Clear cart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearCartButton;
