import { put } from "@vercel/blob";

async function uploadMembershipFile(file: File, folder: string) {
  const safeName = `${crypto.randomUUID()}-${file.name}`;

  const blob = await put(
    `membership/${folder}/${safeName}`,
    file,
    {
      access: "private",
      addRandomSuffix: false,
    }
  );

  return blob.url;
}