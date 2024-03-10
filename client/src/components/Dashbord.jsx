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
import { FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiChevronDown } from "react-icons/fi";
import { IoPersonCircleSharp } from "react-icons/io5";
import useAuth from "../hook/useAuth";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import DataTableDemo from "./Table";

const SidebarContent = ({ onClose, handleContentChange, userRole, ...rest }) => {
  const sidebarItems = [
    { name: "Users", icon: <FaRegUser size={21.5} /> },
    { name: "Trending", icon: FiTrendingUp },
    { name: "Explore", icon: FiCompass },
    { name: "Favourites", icon: FiStar },
    { name: "Settings", icon: FiSettings },
  ];

  const userRoleSpecificItems = {
    student: ["Users", "Trending", "Explore"],
    admin: ["Users", "Trending", "Explore", "Settings"],
    superadmin: ["Users", "Trending", "Explore", "Favourites", "Settings"],
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
  return (
    <Box as="a" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
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
      <IconButton display={{ base: "flex", md: "none" }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<FiMenu />} />

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
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={useColorModeValue("white", "gray.900")} borderColor={useColorModeValue("gray.200", "gray.700")}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
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
  const navigation = useNavigate();

  const handleContentChange = (content) => {
    navigation(content);
    onClose();
  };

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
          <Route path="/Users" element={<DataTableDemo />} />
          <Route path="/trending" element={<div>Trending Content</div>} />
          <Route path="/explore" element={<div>Explore Content</div>} />
          <Route path="/favourites" element={<div>Favourites Content</div>} />
          <Route path="/settings" element={<div>Settings Content</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashbord;
