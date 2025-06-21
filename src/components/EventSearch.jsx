import { useState, useEffect } from "react";
import { Input, Button, ButtonGroup, Box } from "@chakra-ui/react";
import { AddEventModal } from "./AddEventModal";

export const EventSearch = ({ events, categories, onFilteredEventsChange }) => {
  const [searchField, setSearchField] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Toggle category selection
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Filter events whenever search or selectedCategories change
  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesTitle = event.title
        .toLowerCase()
        .includes(searchField.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        (event.categoryIds || []).some((id) => selectedCategories.includes(id));

      return matchesTitle && matchesCategory;
    });

    onFilteredEventsChange(filtered);
  }, [searchField, selectedCategories, events, onFilteredEventsChange]);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      maxWidth="600px"
      margin="auto"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Input
        placeholder="Search events..."
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        mt={4}
        mb={4}
        maxW="400px"
        variant="outline"
        focusBorderColor="teal.500"
        display="block"
      />
      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        flexWrap="wrap"
        gap={2}
        display="flex"
        justifyContent="center"
      >
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            colorScheme={selectedCategories.includes(cat.id) ? "teal" : "gray"}
            variant={selectedCategories.includes(cat.id) ? "solid" : "outline"}
          >
            {cat.name}
          </Button>
        ))}
      </ButtonGroup>
      <AddEventModal>Add Event</AddEventModal>
    </Box>
  );
};
