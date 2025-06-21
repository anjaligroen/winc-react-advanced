import { useContext, useState, useEffect } from "react";
import { Heading, Text, Stack, Button } from "@chakra-ui/react";
import { AppContext } from "../components/Context";
import { EventSearch } from "../components/EventSearch.jsx";
import { EventsList } from "../components/EventsList.jsx";

export const EventsPage = () => {
  const { events, categories, loading, error } = useContext(AppContext);
  const [filteredEvents, setFilteredEvents] = useState(events || []);

  const categoryMap = {};
  (categories || []).forEach(({ id, name }) => {
    categoryMap[id] = name;
  });

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const dt = new Date(dateTimeStr);
    if (isNaN(dt)) return dateTimeStr;
    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Keep filteredEvents updated when events change (initial load or updates)
  useEffect(() => {
    setFilteredEvents(events || []);
  }, [events]);

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
  if (!Array.isArray(events)) return <Text>No events available.</Text>;

  return (
    <Stack spacing={6}>
      <Heading textAlign={"center"} marginTop={10}>
        Events
      </Heading>

      <EventSearch
        events={events}
        categories={categories || []}
        onFilteredEventsChange={setFilteredEvents}
      />

      {filteredEvents.length === 0 ? (
        <Text textAlign={"center"}>
          No events found matching your criteria.
        </Text>
      ) : (
        <Text textAlign={"center"}>
          Found {filteredEvents.length} event
          {filteredEvents.length !== 1 ? "s" : ""}
        </Text>
      )}

      <EventsList
        events={filteredEvents}
        categoryMap={categoryMap}
        formatDateTime={formatDateTime}
      />
    </Stack>
  );
};
