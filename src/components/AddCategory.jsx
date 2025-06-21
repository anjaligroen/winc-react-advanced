import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AppContext } from "./Context";

export const AddCategory = ({ setSelectedIds }) => {
  const { setCategories } = useContext(AppContext);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      const savedCategory = await res.json();
      setCategories((prev) => [...prev, savedCategory]);
      setSelectedIds((prev) => [...prev, savedCategory.id]);
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  return (
    <FormControl mt={4}>
      <FormLabel>Add New Category</FormLabel>
      <Input
        placeholder="New category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        mb={2}
      />
      <Button size="sm" colorScheme="green" onClick={handleAddCategory}>
        Add Category
      </Button>
    </FormControl>
  );
};
