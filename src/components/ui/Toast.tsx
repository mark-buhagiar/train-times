/**
 * Toast notification system
 * Provides feedback for user actions with animated toasts
 */

import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils/haptics";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react-native";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastConfig: Record<
  ToastType,
  { icon: typeof CheckCircle; color: string; bgColor: string }
> = {
  success: {
    icon: CheckCircle,
    color: theme.success,
    bgColor: "rgba(34, 197, 94, 0.15)",
  },
  error: {
    icon: AlertCircle,
    color: theme.error,
    bgColor: "rgba(239, 68, 68, 0.15)",
  },
  warning: {
    icon: AlertTriangle,
    color: theme.warning,
    bgColor: "rgba(245, 158, 11, 0.15)",
  },
  info: {
    icon: Info,
    color: theme.info,
    bgColor: "rgba(59, 130, 246, 0.15)",
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15).stiffness(150)}
      exiting={FadeOutUp.springify().damping(15).stiffness(150)}
      layout={Layout.springify()}
      className="mx-4 mb-2"
    >
      <View
        className="flex-row items-center p-4 rounded-2xl border border-border"
        style={{ backgroundColor: theme.surface.DEFAULT }}
      >
        {/* Icon */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon size={22} color={config.color} />
        </View>

        {/* Content */}
        <View className="flex-1 mr-2">
          <Text className="text-text font-semibold text-base">
            {toast.title}
          </Text>
          {toast.message && (
            <Text className="text-text-secondary text-sm mt-0.5">
              {toast.message}
            </Text>
          )}
        </View>

        {/* Dismiss button */}
        <Pressable
          onPress={onDismiss}
          className="p-2 -mr-2"
          hitSlop={8}
          accessibilityLabel="Dismiss"
        >
          <X size={18} color={theme.text.muted} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const insets = useSafeAreaInsets();

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration = toast.duration ?? 4000;

      // Haptic feedback based on type
      if (toast.type === "success") {
        haptics.notification("success");
      } else if (toast.type === "error") {
        haptics.notification("error");
      } else {
        haptics.impact("light");
      }

      setToasts((prev) => [...prev, { ...toast, id }]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => hideToast(id), duration);
      }
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toast container */}
      <View
        className="absolute left-0 right-0 z-50"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

/**
 * Hook to show toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Convenience functions for common toast types
 */
export const toast = {
  success: (title: string, message?: string) => ({
    type: "success" as const,
    title,
    message,
  }),
  error: (title: string, message?: string) => ({
    type: "error" as const,
    title,
    message,
  }),
  warning: (title: string, message?: string) => ({
    type: "warning" as const,
    title,
    message,
  }),
  info: (title: string, message?: string) => ({
    type: "info" as const,
    title,
    message,
  }),
};
