import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in boundary:", error, errorInfo);
    // You can also log the error to an external service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} textAlign="center">
          <Heading size="lg" mb={4}>
            Something went wrong.
          </Heading>
          <Text mb={4} color="gray.600">
            {this.state.error?.message || "An unexpected error occurred."}
          </Text>
          <Button
            as={RouterLink}
            to="/"
            colorScheme="teal"
            onClick={this.handleReset}
          >
            Go Home
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
