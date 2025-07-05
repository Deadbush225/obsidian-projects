<script lang="ts">
  import {
    Button,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Typography,
  } from "obsidian-svelte";

  export let fileName: string;
  export let onOverwrite: () => void;
  export let onRename: () => void;
  export let onCancel: () => void;
</script>

<ModalLayout title="File Conflict">
  <ModalContent>
    <Typography variant="body">
      A file named "{fileName}" already exists in the destination folder. What
      would you like to do?
    </Typography>
  </ModalContent>
  <ModalButtonGroup>
    <Button variant="destructive" on:click={onOverwrite}>
      Overwrite existing file
    </Button>
    <Button variant="primary" on:click={onRename}>Rename (add suffix)</Button>
    <Button on:click={onCancel}>Cancel</Button>
  </ModalButtonGroup>
</ModalLayout>
