import { CreatePostForm } from "@/features/dashboard";

export default function CreatePostPage() {
  return (
    <div>
      <h1
        className="mb-1 font-serif text-2xl font-extrabold tracking-tight text-white"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        New post
      </h1>
      <p className="mb-6 text-sm text-white/35">
        Share text or a photo with your local community.
      </p>
      <CreatePostForm variant="modal" />
    </div>
  );
}
