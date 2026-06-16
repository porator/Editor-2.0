import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { EmptyState } from "@/components/patterns/EmptyState";
import { Button } from "@/components/atoms/Button";
import { Inbox } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/Empty State",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      icon={Inbox}
      title="No items yet"
      description="Create your first item to get started"
      action={<Button>Create Item</Button>}
    />
  ),
};

export const WithoutAction: Story = {
  render: () => (
    <EmptyState
      icon={Inbox}
      title="No items yet"
      description="Create your first item to get started"
    />
  ),
};
