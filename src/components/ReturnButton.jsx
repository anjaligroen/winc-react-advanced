import { IconButton, Tooltip } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

export const ReturnButton = () => {
  return (
    <Tooltip label="Back to Events" aria-label="Back to Events">
      <IconButton
        as={RouterLink}
        to="/"
        icon={<ArrowBackIcon />}
        variant="outline"
        colorScheme="teal"
        aria-label="Go back"
      />
    </Tooltip>
  );
};
