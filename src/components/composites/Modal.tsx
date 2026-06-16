import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        {children}
      </div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-1 mb-4", className)}
    {...props}
  />
);

const ModalTitle = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
);

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex justify-end gap-2 mt-6", className)}
    {...props}
  />
);

export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalFooter };
