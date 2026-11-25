import { redirect } from "next/navigation";

interface RegisterPageProps {
  searchParams: Promise<{ track?: string; project?: string }>;
}

export default async function RegisterRedirectPage({
  searchParams,
}: RegisterPageProps) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set("next", "/register");
  if (sp.track) params.set("track", sp.track);
  if (sp.project) params.set("project", sp.project);
  redirect(`/login?${params.toString()}`);
}
