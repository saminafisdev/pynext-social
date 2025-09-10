import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: getUserData,
  });

  return (
    <div>
      <h1>Profile Page</h1>
      <div>{isPending ? "Loading..." : data.username}</div>
    </div>
  );
}

const getUserData = async () => {
  const { data } = await api.get("auth/users/me/");
  return data;
};
