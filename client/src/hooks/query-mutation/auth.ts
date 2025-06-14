import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { LoginSchema, RegisterSchema } from "shared/dist";
import { toast } from "sonner";

import honoClient from "@/lib/client";

export function useLoginFn() {
  const navigate = useNavigate();
  const mutation = useMutation<unknown, Error, LoginSchema, unknown>({
    mutationKey: ["login"],
    mutationFn: async (json) => {
      const response = await honoClient.api.auth.login.$post({ json });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    },

    onSuccess: async () => navigate("/dashboard"),
    onError: () => toast.error("Login failed"),
  });

  return mutation;
}

export function useRegisterFn() {
  const navigate = useNavigate();
  const mutation = useMutation<unknown, Error, RegisterSchema, unknown>({
    mutationKey: ["register"],
    mutationFn: async (json) => {
      const response = await honoClient.api.auth.register.$post({ json });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    },

    onSuccess: async () => navigate("/login"),
    onError: () => toast.error("Register failed."),
  });

  return mutation;
}

export function useLogoutFn() {
  const navigate = useNavigate();
  const mutation = useMutation<unknown, Error, RegisterSchema, unknown>({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await honoClient.api.auth.logout.$post();

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    },

    onSuccess: async () => navigate("/login"),
    onError: () => toast.error("Logout failed."),
  });

  return mutation;
}
