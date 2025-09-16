import api from "@/api/apiClient";
import { Button } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await api.post("auth/logout/");
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  return (
    <Button
      w="full"
      textAlign={"left"}
      onClick={() => mutate()}
      loading={isPending}
    >
      <LogOut />
      Sign out
    </Button>
  );
}
