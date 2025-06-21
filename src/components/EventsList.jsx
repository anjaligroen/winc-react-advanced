// src/components/EventsList.jsx

import {
  LinkBox,
  LinkOverlay,
  Stack,
  Heading,
  Image,
  Text,
  Flex,
  Box,
  Tag,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const EventsList = ({ events, categoryMap, formatDateTime }) => {
  return (
    <>
      {events.map((event) => {
        const eventCategories = (event.categoryIds || []).map(
          (id) => categoryMap[id] || "Unknown"
        );

        return (
          <LinkBox
            key={event.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            width={["sm", "md", "lg"]}
            display={"flex"}
            justifyContent={"center"}
            margin={"auto"}
          >
            <Stack spacing={3}>
              <Heading size="md" textAlign={"center"}>
                <LinkOverlay as={RouterLink} to={`/events/${event.id}`}>
                  {event.title}
                </LinkOverlay>
              </Heading>

              {event.image && (
                <Image
                  src={event.image}
                  alt={event.title}
                  borderRadius="md"
                  maxH="200px"
                  objectFit="cover"
                  maxW="100%"
                />
              )}

              <Text>{event.description}</Text>

              <Flex gap={4} flexWrap="wrap">
                <Box>
                  <Text fontWeight="bold">Start:</Text>
                  <Text>{formatDateTime(event.startTime)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">End:</Text>
                  <Text>{formatDateTime(event.endTime)}</Text>
                </Box>
              </Flex>

              <Box>
                <Text fontWeight="bold" mb={1}>
                  Categories:
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {eventCategories.length > 0 ? (
                    eventCategories.map((catName, i) => (
                      <Tag key={i} colorScheme="blue">
                        {catName}
                      </Tag>
                    ))
                  ) : (
                    <Text>No categories</Text>
                  )}
                </Flex>
              </Box>
            </Stack>
          </LinkBox>
        );
      })}
    </>
  );
};
