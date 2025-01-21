export default function prepareUpdates(
  fields: { path: string; value: unknown }[],
  updates: unknown[]
) {
  fields.forEach(({ path, value }) => {
    if (value !== undefined) {
      updates.push({
        op: "replace",
        path,
        value,
      });
    }
  });
  updates.push({
    op: "replace",
    path: "/updated_at",
    value: new Date(),
  });
}
