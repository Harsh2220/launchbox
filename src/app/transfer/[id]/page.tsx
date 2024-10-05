import { TransferClient } from "@/components/TransferClient";

export default async function Transfer({
  params,
}: {
  params: { id: string };
}) {

  return (
    <div>
      <TransferClient id={params.id} />
    </div>
  );
}
