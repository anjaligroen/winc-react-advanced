import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function ContextProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, eventsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/events"),
          fetch("http://localhost:3000/categories"),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

        const usersData = await usersRes.json();
        const eventsData = await eventsRes.json();
        const categoriesData = await categoriesRes.json();

        setUsers(usersData);
        setEvents(eventsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || "Unknown error");
        console.error("Context fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        events,
        setEvents,
        categories,
        setCategories,
        loading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
