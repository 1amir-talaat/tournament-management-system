"use client";

import { Box, Flex, Badge, HStack, VStack, Text, Menu, MenuButton, MenuList, MenuItem, useColorModeValue, Stack } from "@chakra-ui/react";
import { IoPersonCircleSharp } from "react-icons/io5";
import useAuth from "../hook/useAuth";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

export default function WithAction() {
  const { logout, isLogin, user } = useAuth();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={"7vw"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
<<<<<<< HEAD
            <Box fontSize={"2xl"}>Torment</Box>
          </HStack>
          <Flex alignItems={"center"}>
            {isLogin ? (
              <Menu>
                <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                  <BiSolidUserCircle size={40} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => logout()}>Sign out</MenuItem>
                </MenuList>
              </Menu>
=======
            <Box fontSize={"2xl"}>Tournament</Box>
          </HStack>
          <Flex alignItems={"center"}>
            {isLogin ? (
              <>
                <HStack spacing={{ base: "0", md: "6" }} px={4}>
                  <Flex alignItems={"center"} gap={4}>
                    <Badge fontSize="0.9em" p="1" px={2} height={"fit-content"} ml="1" colorScheme="green">
                      {user && user.points} point
                    </Badge>
                    <Menu>
                      <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                        <HStack>
                          <IoPersonCircleSharp size={35} />
                          <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px">
                            <Text fontSize="sm">{user && user.name}</Text>
                            <Text fontSize="xs" color="gray.600">
                              {user && user.role}
                            </Text>
                          </VStack>
                          <Box display={{ base: "none", md: "flex" }}>
                            <FaAngleDown />
                          </Box>
                        </HStack>
                      </MenuButton>
                      <MenuList bg={useColorModeValue("white", "gray.900")} borderColor={useColorModeValue("gray.200", "gray.700")}>
                        <MenuItem onClick={() => logout()}>Sign out</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </HStack>
              </>
>>>>>>> 53f33c7 (.)
            ) : (
              <Stack flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} spacing={4}>
                <Button variant="link" style={{ fontSize: "18px" }}>
                  <Link to={"/login"}>Sign In</Link>
                </Button>
                <Button variant="blue">
                  <Link to={"/register"}>Sign Up</Link>
                </Button>
              </Stack>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
