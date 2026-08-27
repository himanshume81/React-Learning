import { apiFetch } from "@/lib/api-client";
import type { Banner, BannerInput } from "@/types/banner";

type RawBanner = {
  id: number | string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  sortOrder?: number | string | null;
};

type BannerListResponse =
  | RawBanner[]
  | {
      data?: RawBanner[];
      items?: RawBanner[];
      banners?: RawBanner[];
    };

export const BANNER_LIMITS = {
  maxFeatured: 5,
} as const;

function normalizeBannerListResponse(payload: BannerListResponse): RawBanner[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.items)) {
      return payload.items;
    }

    if (Array.isArray(payload.banners)) {
      return payload.banners;
    }
  }

  return [];
}

function toBanner(raw: RawBanner): Banner {
  const parsedSortOrder = Number(raw.sortOrder);
  const sortOrder =
    Number.isInteger(parsedSortOrder) && parsedSortOrder > 0
      ? parsedSortOrder
      : null;

  return {
    id: String(raw.id),
    title: raw.title ?? "",
    description: raw.description ?? "",
    imageUrl: raw.imageUrl ?? raw.image ?? "",
    featuredRank: sortOrder,
  };
}

function toBannerPayload(input: Partial<BannerInput>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) {
    payload.title = input.title.trim();
  }

  if (input.description !== undefined) {
    payload.description = input.description.trim();
  }

  if (input.imageUrl !== undefined) {
    payload.image = input.imageUrl;
  }

  if (input.featuredRank !== undefined) {
    payload.sortOrder = input.featuredRank;
  }

  return payload;
}

function sortBanners(banners: Banner[]) {
  return [...banners].sort((left, right) => {
    if (left.featuredRank === null && right.featuredRank === null) {
      return left.title.localeCompare(right.title);
    }

    if (left.featuredRank === null) {
      return 1;
    }

    if (right.featuredRank === null) {
      return -1;
    }

    return left.featuredRank - right.featuredRank;
  });
}

export async function fetchBanners(): Promise<Banner[]> {
  const raw = await apiFetch<BannerListResponse>("/banners", { auth: true });
  return sortBanners(normalizeBannerListResponse(raw).map(toBanner));
}

export async function uploadBannerImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const raw = await apiFetch<{ url?: string; secure_url?: string; image?: string; data?: { url?: string } }>(
    "/uploads?folder=banners",
    {
      method: "POST",
      body: formData,
      auth: true,
    }
  );

  return raw.url ?? raw.secure_url ?? raw.image ?? raw.data?.url ?? "";
}

export async function createBanner(input: BannerInput): Promise<Banner> {
  const raw = await apiFetch<RawBanner>("/banners", {
    method: "POST",
    body: toBannerPayload(input),
    auth: true,
  });

  return toBanner(raw);
}

export async function updateBanner(
  id: string,
  input: Partial<BannerInput>
): Promise<Banner> {
  const raw = await apiFetch<RawBanner>(`/banners/${id}`, {
    method: "PATCH",
    body: toBannerPayload(input),
    auth: true,
  });

  return toBanner(raw);
}

export async function deleteBanner(id: string): Promise<void> {
  await apiFetch<void>(`/banners/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function reorderBanner(
  banner: Banner,
  nextSortOrder: number | null
): Promise<void> {
  await updateBanner(banner.id, {
    featuredRank: nextSortOrder,
  });
}
