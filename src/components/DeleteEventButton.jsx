import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Context";

export const DeleteEventButton = ({ eventId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();
  const { events, setEvents, categories, setCategories } =
    useContext(AppContext);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      // Update events state
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);

      // Find which categories are no longer used
      const stillUsedCategoryIds = new Set();
      updatedEvents.forEach((event) => {
        (event.categoryIds || []).forEach((id) => stillUsedCategoryIds.add(id));
      });

      const filteredCategories = categories.filter((cat) =>
        stillUsedCategoryIds.has(cat.id)
      );
      setCategories(filteredCategories);

      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Event
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you absolutely sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
