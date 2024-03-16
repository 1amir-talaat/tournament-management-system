import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { MdPerson } from "react-icons/md";
import useAuth from "../hook/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ChoseEventsCount() {
  const [selectedValue, setSelectedValue] = useState("one");
  const { user, token, refreshToken, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showContetnt, setShowContent] = useState(false);

  const navigate = useNavigate();

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    if (user) {
      if (user.maxEvents !== null) {
        navigate("/dashboard");
      } else {
        setShowContent(true);
      }
    }
  }, [navigate, user]);

  console.log(user);

  const handleSubmit = async () => {
    let maxEvents;
    if (selectedValue === "one") {
      maxEvents = 1;
    } else if (selectedValue === "five") {
      maxEvents = 5;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5002/user/changeMaxEvents`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ maxEvents, id: user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update max events");
      }

      try {
        await refreshToken();
      } catch (error) {
        toast.error(error.message);
        logout();
        return;
      }
      setLoading(false);
      toast.success("student data updated successfully");

      const timeout = setTimeout(() => {
        navigate("/dashboard");
      }, 600);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error updating max events:", error);
    }
  };

  return (
    <>
      {showContetnt && (
        <div className="w-screen h-screen flex items-center justify-center flex-col gap-10">
          <Toaster position="bottom-right" reverseOrder={false} />
          <RadioGroup defaultValue="one" onValueChange={handleChange} className="grid grid-cols-2 h-fit gap-10">
            <div className="h-fit">
              <RadioGroupItem value="one" id="one" className="peer sr-only h-fit" />
              <Label
                htmlFor="one"
                className={`flex flex-col  items-center justify-between rounded-md border-2 border-muted bg-popover p-7 hover:bg-accent hover:text-accent-foreground ${
                  selectedValue === "one" ? "border-2 border-cyan-700" : ""
                } `}
              >
                <MdPerson className="mb-2" size={60} />

                <h2 className="mb-2 text-xl">Participate in one event only</h2>
                <p className="text-base">Join one event and compete</p>
              </Label>
            </div>
            <div className="h-fit">
              <RadioGroupItem value="five" id="five" className="peer sr-only" />
              <Label
                htmlFor="five"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-7 hover:bg-accent hover:text-accent-foreground ${
                  selectedValue === "five" ? "border-2 border-cyan-700" : ""
                }`}
              >
                <HiMiniUserGroup className="mb-2" size={60} />

                <h2 className="mb-2 text-xl">Participate in five events</h2>
                <p className="text-base">Join five events with additional perks</p>
              </Label>
            </div>
          </RadioGroup>
          <Button colorScheme="blue" isLoading={loading} _focus={{ outline: "none" }} onClick={handleSubmit}>
            {loading ? <Spinner /> : "Next"}
          </Button>
        </div>
      )}
    </>
  );
}
