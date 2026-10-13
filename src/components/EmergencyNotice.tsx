export const EMERGENCY_TEXT =
  "This app is not monitored for emergencies. If you or someone else is in immediate danger, call 911. For a mental health crisis in the United States, call or text 988.";

export function EmergencyNotice({ id }: { id?: string }) {
  return (
    <div className="emergency" role="note" aria-label="Emergency notice" id={id}>
      <strong>This app is not monitored for emergencies.</strong> If you or someone else is in immediate danger,
      call <a href="tel:911">911</a>. For a mental health crisis in the United States, call or text{" "}
      <a href="tel:988">988</a>.
    </div>
  );
}
