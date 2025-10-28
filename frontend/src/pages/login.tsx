import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { PasswordInput } from "@/components/ui/password-input";
import {
  AbsoluteCenter,
  Box,
  Button,
  Field,
  Fieldset,
  Icon,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { Link, useNavigate } from "react-router";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username required" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (loginFields: LoginInput) => {
      const { data } = await api.post("auth/jwt/create/", loginFields);
      return data;
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      await loginMutation.mutateAsync(values);
      reset();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AbsoluteCenter w="full" p="2">
      <Box as="form" maxW="md" boxSize={"lg"} onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root size="lg" maxW="md">
          <Stack>
            <Icon size={"2xl"} color={"yellow.500"} mx="auto" my={4}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 15c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3c2.482 0 4.965-3 4.965-3s2.483 3 4.345 3M3 20c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3c2.482 0 4.965-3 4.965-3s2.483 3 4.345 3m-2-10a7 7 0 1 0-14 0"
                ></path>
              </svg>
            </Icon>
            <Fieldset.Legend fontSize={"2xl"} textAlign={"center"}>
              Sign in to Social
            </Fieldset.Legend>
          </Stack>

          <Fieldset.Content>
            <Field.Root invalid={Boolean(errors.username)}>
              <Field.Label>Username</Field.Label>
              <Input type="text" {...register("username")} />
              {errors.username && (
                <Field.ErrorText>{errors.username.message}</Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={Boolean(errors.password)}>
              <Field.Label>Password</Field.Label>
              <PasswordInput {...register("password")} />
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>
          </Fieldset.Content>

          <Button
            type="submit"
            loading={loginMutation.isPending}
            loadingText="Signing in"
          >
            Sign in
          </Button>

          <Text>
            Don't have an account?{" "}
            <ChakraLink colorPalette={"blue"} asChild>
              <Link to={"/signup"}>Sign up</Link>
            </ChakraLink>
          </Text>
        </Fieldset.Root>
      </Box>
    </AbsoluteCenter>
  );
}
