import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/composites/Modal";
import { Button } from "@/components/atoms/Button";

const meta: Meta<typeof Modal> = {
  title: "Composites/Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Confirm Action</ModalTitle>
        </ModalHeader>
        <p style={{ padding: "0 24px 16px" }}>
          Are you sure you want to proceed? This action will apply your changes.
        </p>
        <ModalFooter>
          <ModalTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </ModalTrigger>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Item</ModalTitle>
        </ModalHeader>
        <p style={{ padding: "0 24px 16px" }}>
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <ModalFooter>
          <ModalTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </ModalTrigger>
          <Button variant="destructive">Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};
