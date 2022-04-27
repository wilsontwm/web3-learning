import { toast } from "react-toastify";

export function showNotification(
  message: string,
  type: "success" | "error" | "warning" | "info"
) {
  switch (type) {
    case "success":
      toast.success;
      break;
    case "error":
      break;
    case "warning":
      break;
    case "info":
      break;
    default:
      return;
  }

  toast(message, {
    type: type,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
