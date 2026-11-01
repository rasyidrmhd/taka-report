import { useMemo } from "react";
import {
  Flex,
  IconButton,
  Menu,
  Portal,
  TreeView,
  createTreeCollection,
} from "@chakra-ui/react";
import { LuFile, LuFolder, LuPlus } from "react-icons/lu";
import { CATEGORIES, type Project, type TreeNode } from "@/types/domain";

interface Props {
  projects: Project[];
  onNewProject: () => void;
}

function AddMenu({ onNewProject }: { onNewProject: () => void }) {
  return (
    <Menu.Root
      onSelect={(d) => {
        if (d.value === "new-project") onNewProject();
      }}
      positioning={{ placement: "bottom-end" }}
    >
      <Menu.Trigger asChild>
        <IconButton aria-label="Add" size="2xs" variant="outline">
          <LuPlus />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-project">New Project</Menu.Item>
            {/* TODO: wire up when drafts exist */}
            <Menu.Item value="open-draft" disabled>
              Open Draft
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default function JobTree({ projects, onNewProject }: Props) {
  const collection = useMemo(() => {
    const rootNode: TreeNode = {
      id: "ROOT",
      name: "",
      children: [
        {
          id: "job",
          name: "Job",
          children: CATEGORIES.map((c) => ({
            id: c.value,
            name: c.label,
            children: projects
              .filter((p) => p.category === c.value)
              .map((p) => ({ id: p.id, name: p.workOrderRelease.number })),
          })),
        },
      ],
    };
    return createTreeCollection<TreeNode>({
      nodeToValue: (n) => n.id,
      nodeToString: (n) => n.name,
      rootNode,
    });
  }, [projects]);

  return (
    <TreeView.Root
      collection={collection}
      defaultExpandedValue={["job", ...CATEGORIES.map((c) => c.value)]}
    >
      <TreeView.Tree>
        <TreeView.Node
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) =>
            nodeState.isBranch ? (
              node.id === "job" ? (
                <Flex align="center" gap="2">
                  <TreeView.BranchControl flex="1">
                    <LuFolder />
                    <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  </TreeView.BranchControl>
                  <AddMenu onNewProject={onNewProject} />
                </Flex>
              ) : (
                <TreeView.BranchControl>
                  <LuFolder />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              )
            ) : (
              <TreeView.Item>
                <LuFile />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
