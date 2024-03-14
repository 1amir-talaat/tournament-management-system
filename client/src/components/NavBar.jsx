"use client";

import { Box, Flex, Avatar, HStack, Menu, MenuButton, MenuList, MenuItem, useColorModeValue, Stack } from "@chakra-ui/react";
import { BiSolidUserCircle } from "react-icons/bi";
import useAuth from "../hook/useAuth";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function WithAction() {
  const { logout, isLogin } = useAuth();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={"7vw"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
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
