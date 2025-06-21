import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage, loader as postLoader } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { ContextProvider } from "./components/Context";
import { ErrorBoundary } from "./components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/events/:eventId",
        element: <EventPage />,
        loader: postLoader,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <ContextProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
