// src/components/AddEventModal.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  useToast,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AppContext } from "./Context";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGES = [
  "https://wincacademy.github.io/webpages/media/hiking.png",
  "https://wincacademy.github.io/webpages/media/pexels-viktoria-alipatova-1083711-2130137.jpg",
  "https://wincacademy.github.io/webpages/media/pexels-tima-miroshnichenko-6598746.jpg",
  "https://wincacademy.github.io/webpages/media/pexels-gabby-k-5384538.jpg",
  "https://wincacademy.github.io/webpages/media/pexels-floriandoppler-3207474.jpg",
  "https://wincacademy.github.io/webpages/media/lasertag.jpg",
];

const getRandomImage = () =>
  DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];

export const AddEventModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const { categories, setEvents } = useContext(AppContext);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    image: "",
    categoryIds: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (id) => {
    setNewEvent((prev) => {
      const updatedIds = prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((cid) => cid !== id)
        : [...prev.categoryIds, id];
      return { ...prev, categoryIds: updatedIds };
    });
  };

  const validateFields = () => {
    const missing = ["title", "description", "startTime", "endTime"].filter(
      (field) => newEvent[field].trim() === ""
    );

    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missing.join(", ")}`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const eventToSubmit = {
      ...newEvent,
      image: newEvent.image.trim() || getRandomImage(),
    };

    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventToSubmit),
      });

      if (!res.ok) throw new Error("Failed to add event");

      const createdEvent = await res.json();
      navigate(`/events/${createdEvent.id}`, { replace: true });

      setEvents((prev) => [...prev, createdEvent]);

      toast({
        title: "Event created",
        description: "Your event has been added successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong while adding the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" mt={6}>
        Add Event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={newEvent.title}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={newEvent.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={newEvent.startTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={newEvent.endTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Categories</FormLabel>
              <VStack align="start" spacing={2}>
                {categories.map((cat) => (
                  <Checkbox
                    key={cat.id}
                    isChecked={newEvent.categoryIds.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  >
                    {cat.name}
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image URL (optional)</FormLabel>
              <Input
                name="image"
                value={newEvent.image}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
