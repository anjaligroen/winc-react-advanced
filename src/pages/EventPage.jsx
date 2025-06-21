import { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { EditEventModal } from "../components/EditEventModal";
import {
  Box,
  Heading,
  Text,
  Image,
  Center,
  Button,
  HStack,
} from "@chakra-ui/react";
import { DeleteEventButton } from "../components/DeleteEventButton";
import { AppContext } from "../components/Context";
import { ReturnButton } from "../components/ReturnButton";

export const loader = async ({ params }) => {
  const { eventId } = params;
  const eventRes = await fetch(`http://localhost:3000/events/${eventId}`);
  if (!eventRes.ok) throw new Error("Failed to fetch event");
  const event = await eventRes.json();

  let user = null;
  if (event.createdBy) {
    const userRes = await fetch(
      `http://localhost:3000/users/${event.createdBy}`
    );
    if (userRes.ok) {
      user = await userRes.json();
    }
  }

  return { event, user };
};

export const EventPage = () => {
  const { event: initialEvent, user } = useLoaderData();
  const { loading, error, categories } = useContext(AppContext);

  // Store event in state so we can update it on save and re-render
  const [event, setEvent] = useState(initialEvent);

  const handleUpdate = async (updatedData) => {
    try {
      const res = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update event");

      const updatedEvent = await res.json();
      setEvent(updatedEvent); // Update state to re-render with new data
      console.log("Event updated", updatedEvent);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <Button
        isLoading
        loadingText="Loading"
        colorScheme="teal"
        variant="outline"
        spinnerPlacement="start"
      />
    );
  if (error) return <Text color="red.500">Error: {error}</Text>;
  if (!event) {
    return (
      <Center>
        <Heading textAlign={"center"}>Event not found</Heading>
      </Center>
    );
  }

  const categoryNames =
    categories
      .filter((cat) => event.categoryIds?.includes(cat.id))
      .map((cat) => cat.name)
      .join(", ") || "No categories";

  return (
    <Box p={4} position="relative" maxW="800px" margin="auto">
      <Box position="absolute" top="1rem" left="1rem">
        <ReturnButton />
      </Box>
      <Heading mb={4} textAlign={"center"} fontSize={{ base: "xl", md: "2xl" }}>
        {event.title}
      </Heading>
      <Image
        src={event.image}
        alt={event.title}
        borderRadius="md"
        maxW="80%"
        maxH="300px"
        objectFit="cover"
        margin="auto"
        display="block"
        mb={4}
        marginTop={10}
      />
      <Text fontSize="lg" mb={2}>
        {event.description}
      </Text>
      <Text mb={2}>
        <strong>Start:</strong> {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text mb={2}>
        <strong>End:</strong> {new Date(event.endTime).toLocaleString()}
      </Text>
      <Text mb={2}>
        <strong>Categories:</strong> {categoryNames}
      </Text>
      {user && (
        <Box mt={4}>
          <Text>
            <strong>Created by:</strong> {user.name}
          </Text>
          {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              boxSize="100px"
              borderRadius="full"
              mt={2}
            />
          )}
        </Box>
      )}
      <HStack spacing={4} mt={4} justifyContent="center" alignItems="center">
        <EditEventModal event={event} onUpdate={handleUpdate} />
        <DeleteEventButton eventId={event.id} />
      </HStack>
    </Box>
  );
};
