import api from "@/api/apiClient";
import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export default function LogoutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await api.post("auth/logout/");
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", {
        replace: true,
      });
    },
  });

  return (
    <Button
      w="full"
      textAlign={"left"}
      onClick={() => mutate()}
      loading={isPending}
      variant={"solid"}
      size={"md"}
    >
      <LogOut />
      Sign out
    </Button>
  );
}
