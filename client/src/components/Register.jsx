import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  Spinner,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { z } from "zod";
import { AuthContext } from "../context/AuthContext";

const nameSchema = z.string().nonempty("Name is required");
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const { register, loading } = useContext(AuthContext);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setNameError("");
    setEmailError("");
    setPasswordError("");

    const nameValidation = nameSchema.safeParse(name);
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!nameValidation.success) {
      setNameError(nameValidation.error.issues[0].message);
      return;
    }

    if (!emailValidation.success) {
      setEmailError(emailValidation.error.issues[0].message);
      return;
    }

    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error.issues[0].message);
      return;
    }

    try {
      await register(name, email, password, setError);
      // Handle successful registration, such as redirecting to another page
    } catch (err) {
      console.error("Registration error:", err.message);
    }
  };
  return (
    <Flex minH={"100vh"} minW={"100vw"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={10} mx={"auto"} minW={"500px"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Stack spacing={4}>
            <FormControl id="name" isRequired isInvalid={!!nameError}>
              <FormLabel>Name</FormLabel>
              <Input type="text" value={name} onChange={handleNameChange} />
              <Box color="red" fontSize="sm">
                {nameError}
              </Box>
            </FormControl>
            <FormControl id="email" isRequired isInvalid={!!emailError}>
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
            <Stack spacing={10} pt={2}>
              <Button colorScheme="blue" _focus={{ outline: "none" }} isLoading={loading} onClick={handleSubmit}>
                {loading ? <Spinner /> : "Sign Up"}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user
                <Link to={"/login"} color={"blue.400"}>
                  <Text
                    _hover={{
                      color: "blue.500",
                    }}
                    color={"blue.400"}
                    display={"inline"}
                  >
                    {" "}
                    Login
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
