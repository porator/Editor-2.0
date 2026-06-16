import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/composites/Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Composites/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p>This is the Overview tab content. Get a high-level summary here.</p>
      </TabsContent>
      <TabsContent value="details">
        <p>This is the Details tab content. Dive deeper into specifics here.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p>This is the Settings tab content. Configure your preferences here.</p>
      </TabsContent>
    </Tabs>
  ),
};

const ControlledTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <p style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
        Active tab: <strong>{activeTab}</strong>
      </p>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p>Controlled Overview content.</p>
        </TabsContent>
        <TabsContent value="details">
          <p>Controlled Details content.</p>
        </TabsContent>
        <TabsContent value="settings">
          <p>Controlled Settings content.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledTabs />,
};
