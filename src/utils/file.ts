import fs from "fs";

export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    // --- Verifica se o arquivo existe ---
    await fs.promises.stat(fileName);
  } catch {
    return;
  }

  await fs.promises.unlink(fileName);
};
