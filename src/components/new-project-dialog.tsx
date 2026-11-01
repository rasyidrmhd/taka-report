import { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  RadioCard,
  SimpleGrid,
  Steps,
  Text,
} from "@chakra-ui/react";

import {
  STEPS,
  CATEGORIES,
  type Project,
  type CategoryId,
} from "@/types/domain";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
}

export default function NewProjectDialog({
  open,
  onOpenChange,
  onSave,
}: Props) {
  const [category, setCategory] = useState<CategoryId>("manufacture");
  const [step, setStep] = useState(0);
  const [worNumber, setWorNumber] = useState("");

  const lastStep = STEPS.length - 1;
  const canSave = worNumber.trim().length > 0;

  const reset = () => {
    setCategory("manufacture");
    setStep(0);
    setWorNumber("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: crypto.randomUUID(),
      category,
      workOrderRelease: { number: worNumber.trim() },
      createdAt: new Date().toISOString(),
    });
    handleOpenChange(false);
  };

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={(e) => handleOpenChange(e.open)}
      scrollBehavior="inside"
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>New Project</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body display="flex" flexDirection="column" gap="6">
              <RadioCard.Root
                value={category}
                onValueChange={(e) => {
                  if (e.value) setCategory(e.value as CategoryId);
                }}
              >
                <RadioCard.Label>Job category</RadioCard.Label>
                <SimpleGrid columns={{ base: 2, md: 4 }} gap="3">
                  {CATEGORIES.map((c) => (
                    <RadioCard.Item key={c.value} value={c.value}>
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemText>{c.label}</RadioCard.ItemText>
                        <RadioCard.ItemIndicator />
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  ))}
                </SimpleGrid>
              </RadioCard.Root>

              <Steps.Root
                step={step}
                onStepChange={(e) => setStep(e.step)}
                count={STEPS.length}
              >
                <Steps.List>
                  {STEPS.map((s, i) => (
                    <Steps.Item key={s.key} index={i} title={s.title}>
                      <Steps.Indicator />
                      <Steps.Title>{s.title}</Steps.Title>
                      <Steps.Separator />
                    </Steps.Item>
                  ))}
                </Steps.List>

                <Steps.Content index={0}>
                  <Field.Root required mt="4">
                    <Field.Label>
                      Number of WOR <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      value={worNumber}
                      onChange={(e) => setWorNumber(e.target.value)}
                      placeholder="e.g. 001"
                    />
                  </Field.Root>
                </Steps.Content>

                <Steps.Content index={1}>
                  <Text mt="4">Work Plan step content</Text>
                </Steps.Content>

                <Steps.Content index={2}>
                  <Text mt="4">ITP step content</Text>
                </Steps.Content>
              </Steps.Root>
            </Dialog.Body>

            <Dialog.Footer justifyContent="space-between">
              <HStack>
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === lastStep}
                >
                  Next
                </Button>
              </HStack>
              <HStack>
                <Dialog.ActionTrigger asChild>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={handleSave}
                  disabled={!canSave}
                >
                  Save
                </Button>
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
