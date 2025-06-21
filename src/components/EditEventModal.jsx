import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Context"; // Adjust path if needed

export const EditEventModal = ({ event, onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { categories } = useContext(AppContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        image: event.image || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        categoryIds: event.categoryIds || [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((cid) => cid !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleSubmit = async () => {
    try {
      await onUpdate(formData);
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Edit Event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Categories</FormLabel>
              <VStack align="start">
                {categories.map((cat) => (
                  <Checkbox
                    key={cat.id}
                    isChecked={formData.categoryIds.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  >
                    {cat.name}
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="teal" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
