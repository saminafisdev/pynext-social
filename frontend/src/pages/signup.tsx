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
  HStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { Link, useNavigate } from "react-router";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be 50 characters or fewer"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be 50 characters or fewer"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(254, "Email must be 254 characters or fewer"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(150, "Username must be 150 characters or fewer")
      .regex(/^[\w.@+-]+$/, "Username contains invalid characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or fewer"),
    re_password: z.string(),
  })
  .refine((data) => data.password === data.re_password, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupForm = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      re_password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (registerFields: SignupForm) => {
      const { data } = await api.post("auth/users/", registerFields);
      return data;
    },
  });

  const onSubmit = async (values: SignupForm) => {
    try {
      await loginMutation.mutateAsync(values);
      reset();
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AbsoluteCenter w="full">
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
              Sign up for Social
            </Fieldset.Legend>
          </Stack>

          <Fieldset.Content>
            <HStack>
              <Field.Root invalid={Boolean(errors.firstName)}>
                <Field.Label>First name</Field.Label>
                <Input type="text" {...register("firstName")} />
                {errors.firstName && (
                  <Field.ErrorText>{errors.firstName.message}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={Boolean(errors.lastName)}>
                <Field.Label>Last name</Field.Label>
                <Input type="text" {...register("lastName")} />
                {errors.lastName && (
                  <Field.ErrorText>{errors.lastName.message}</Field.ErrorText>
                )}
              </Field.Root>
            </HStack>

            <Field.Root invalid={Boolean(errors.email)}>
              <Field.Label>Email</Field.Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <Field.ErrorText>{errors.email.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={Boolean(errors.username)}>
              <Field.Label>Username</Field.Label>
              <Input type="text" {...register("username")} />
              {errors.username && (
                <Field.ErrorText>{errors.username.message}</Field.ErrorText>
              )}
            </Field.Root>
            <HStack>
              <Field.Root invalid={Boolean(errors.password)}>
                <Field.Label>Password</Field.Label>
                <PasswordInput {...register("password")} />
                {errors.password && (
                  <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={Boolean(errors.re_password)}>
                <Field.Label>Confirm password</Field.Label>
                <PasswordInput {...register("re_password")} />
                {errors.re_password && (
                  <Field.ErrorText>
                    {errors.re_password.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
            </HStack>
          </Fieldset.Content>

          <Button
            type="submit"
            loading={loginMutation.isPending}
            loadingText="Creating your account"
          >
            Create account
          </Button>

          <Text>
            Already have an account?{" "}
            <ChakraLink colorPalette={"blue"} asChild>
              <Link to={"/login"}>Sign in</Link>
            </ChakraLink>
          </Text>
        </Fieldset.Root>
      </Box>
    </AbsoluteCenter>
  );
}
