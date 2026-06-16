import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { SearchBar } from "@/components/patterns/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Patterns/Search Bar",
  component: SearchBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

const ControlledSearchBar = () => {
  const [value, setValue] = useState("");

  return (
    <SearchBar
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search..."
    />
  );
};

export const Default: Story = {
  render: () => <ControlledSearchBar />,
};

export const Disabled: Story = {
  render: () => (
    <SearchBar
      value=""
      onChange={() => {}}
      placeholder="Search..."
      disabled
    />
  ),
};
