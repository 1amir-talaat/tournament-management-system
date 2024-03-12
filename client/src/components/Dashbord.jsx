/* eslint-disable react/prop-types */
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { IoPersonCircleSharp } from "react-icons/io5";
import useAuth from "../hook/useAuth";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { FaRegUser } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

import UserTable from "./Tables/UserTable";
import AdminTable from "./Tables/AdminTable";

import { IoMenu } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";

const SidebarContent = ({ onClose, handleContentChange, userRole, ...rest }) => {
  const sidebarItems = [
    { name: "Users", icon: <FaRegUser size={21.5} /> },
    { name: "Admins", icon: <RiAdminLine size={21.5} /> },
  ];

  const userRoleSpecificItems = {
    admin: ["Users"],
    superadmin: ["Users", "Admins"],
  };

  const filteredItems = userRoleSpecificItems[userRole] || [];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("gray.50")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200")}
      borderRightColkraor={useColorModeValue("gray.300", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Tournament
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {sidebarItems.map(
        (link) =>
          filteredItems.includes(link.name) && (
            <NavItem key={link.name} icon={link.icon} onClick={() => handleContentChange(link.name)}>
              {link.name}
            </NavItem>
          )
      )}
    </Box>
  );
};

const NavItem = ({ icon, children, onClick, ...rest }) => {
  const location = useLocation();
  return (
    <Box as="a" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        bg={location.pathname.split("/").pop() === children ? "cyan.400" : "transparent"}
        color={location.pathname.split("/").pop() === children ? "white" : "gray.600"}
        role="group"
        cursor="pointer"
        onClick={onClick}
        {...rest}
      >
        {icon && <div className="me-3">{icon}</div>}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, user, ...rest }) => {
  const { logout } = useAuth();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("gray.50")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton display={{ base: "flex", md: "none" }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<IoMenu />} />

      <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Torment
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
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
    </Flex>
  );
};

const Dashbord = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContentChange = (content) => {
    navigate(content);
    onClose();
  };

  let location = useLocation();
  if (location.pathname === "/dashbord/" || location.pathname === "/dashbord") {
    navigate("/dashbord/Users");
  }

  return (
    <Box minH="100vh" w={"100vw"} bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent
        handleContentChange={handleContentChange}
        userRole={user ? user.role : "student"}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SidebarContent userRole={user ? user.role : "student"} handleContentChange={handleContentChange} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} user={user} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Routes>
          <Route path="/Users" element={<UserTable />} />
          <Route path="/Admins" element={<AdminTable />} />
          <Route path="/explore" element={<div>Explore Content</div>} />
          <Route path="/favourites" element={<div>Favourites Content</div>} />
          <Route path="/settings" element={<div>Settings Content</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashbord;
