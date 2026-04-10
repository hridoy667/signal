import { ProfileClient } from "@/features/dashboard/components/profile-client";

type Props = { params: Promise<{ userId: string }> };

export default async function UserProfilePage({ params }: Props) {
  const { userId } = await params;
  return <ProfileClient userId={userId} />;
}
