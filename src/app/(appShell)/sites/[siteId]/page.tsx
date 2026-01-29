// src/app/(appShell)/sites/[siteId]/page.tsx
import { InvestigationSiteDetailViewPage } from '@/features/investigation-sites/components/investigation-site-detail-view-page';

export default async function SiteDetailPage({
  params
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  return <InvestigationSiteDetailViewPage siteId={siteId} />;
}
