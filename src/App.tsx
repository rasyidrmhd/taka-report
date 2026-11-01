import { useState } from "react";
import { Box, Center, Heading } from "@chakra-ui/react";

import JobTree from "./components/job-tree";
import type { Project } from "./types/domain";
import { useLocalStorage } from "./hooks/use-local-storage";
import NewProjectDialog from "./components/new-project-dialog";

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Center h={"100vh"} flexDir="column" gap={"20px"}>
      <Heading size="5xl">Taka Precision Manufacturing Indonesia</Heading>
      <Box borderWidth="1px" rounded="lg" p="4" h="80vh" w="80vw">
        <JobTree projects={projects} onNewProject={() => setDialogOpen(true)} />
      </Box>

      <NewProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={(p) => setProjects((prev) => [...prev, p])}
      />
    </Center>
  );
}

export default App;
