import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  InputGroup,
  Input,
  Spinner,
  Stack,
  Button,
  Heading,
  InputRightElement,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import useAuth from "../hook/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login, user, isLogin, loading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async () => {
    setError(null);
    setEmailError("");
    setPasswordError("");

    try {
      const response = await login(email, password, setError);
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error.message);
      // Handle login error, display error message to user
    }
  };

  if (isLogin) {
    return "";
  }

  return (
    <Flex minH={"100vh"} w={"100vw"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Login to your account</Heading>
        </Stack>
        <Box w={"500px"} rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack mb={3} display={error ? "block" : "none"}>
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          </Stack>
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={!!emailError}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={handleEmailChange} />
              <Box color="red" fontSize="sm">
                {emailError}
              </Box>
            </FormControl>
            <FormControl id="password" isRequired isInvalid={!!passwordError}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} value={password} onChange={handlePasswordChange} />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    _hover={{ outline: "none", border: "none" }}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box color="red" fontSize="sm">
                {passwordError}
              </Box>
            </FormControl>
            <Stack spacing={10}>
              <Button colorScheme="blue" isLoading={loading} _focus={{ outline: "none" }} onClick={handleSubmit}>
                {loading ? <Spinner /> : "Login"}
              </Button>
            </Stack>
            <Stack pt={1}>
              <Text align={"center"}>
                Dont&apos;t Have an Account
                <Link to={"/register"} color={"blue.400"}>
                  <Text
                    _hover={{
                      color: "blue.500",
                    }}
                    color={"blue.400"}
                    ms={1}
                    display={"inline"}
                  >
                    Register
                  </Text>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
