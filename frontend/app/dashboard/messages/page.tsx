import { MessagesList } from "@/components/dashboard/messages-list";

export default function MessagesPage() {
  return (
    <div>
      <h1
        className="mb-1 font-serif text-2xl font-extrabold tracking-tight text-white"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        Messages
      </h1>
      <p className="mb-6 text-sm text-white/35">Your conversations.</p>
      <MessagesList />
    </div>
  );
}
