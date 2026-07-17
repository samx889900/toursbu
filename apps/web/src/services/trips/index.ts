import { prisma } from "@/lib/prisma";
import { Prisma, TripStatus } from "@prisma/client";

/**
 * Service to handle Trip-related business logic and database operations.
 */
export class TripService {
  /**
   * Generates a unique slug for a trip based on its title.
   * If the slug already exists (e.g., "goa"), it will append a number ("goa-2", "goa-3").
   */
  static async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    if (!baseSlug) {
      throw new Error("Cannot generate slug from empty title");
    }

    let slug = baseSlug;
    let counter = 2;
    let isUnique = false;

    while (!isUnique) {
      const existingTrip = await prisma.trip.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existingTrip) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return slug;
  }

  /**
   * Creates a new trip draft.
   */
  static async createTripDraft(data: {
    title: string;
    categoryId: string | null;
    location: string | null;
    startDate: Date | null;
  }) {
    const slug = await this.generateUniqueSlug(data.title);

    return prisma.trip.create({
      data: {
        title: data.title,
        slug,
        categoryId: data.categoryId,
        location: data.location,
        startDate: data.startDate,
        status: TripStatus.DRAFT,
      },
    });
  }

  /**
   * Abstraction for searching trips to allow for future migration to Algolia/Meilisearch.
   */
  static async searchTrips(params: {
    query?: string;
    categoryId?: string;
    status?: TripStatus | TripStatus[];
    page?: number;
    limit?: number;
    orderBy?: "newest" | "price_asc" | "price_desc" | "popularity";
    includeArchived?: boolean;
  }) {
    const {
      query,
      categoryId,
      status,
      page = 1,
      limit = 10,
      orderBy = "newest",
      includeArchived = false,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.TripWhereInput = {
      isArchived: includeArchived ? undefined : false,
      deletedAt: null, // Always exclude soft-deleted items unless explicitly requested
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      if (Array.isArray(status)) {
        where.status = { in: status };
      } else {
        where.status = status;
      }
    }

    let orderByQuery: Prisma.TripOrderByWithRelationInput = {};
    switch (orderBy) {
      case "price_asc":
        orderByQuery = { price: "asc" };
        break;
      case "price_desc":
        orderByQuery = { price: "desc" };
        break;
      case "popularity":
        orderByQuery = { viewCount: "desc" };
        break;
      case "newest":
      default:
        orderByQuery = { createdAt: "desc" };
        break;
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderByQuery,
        include: {
          category: true,
          images: {
            where: { isCover: true },
            take: 1,
          },
        },
      }),
      prisma.trip.count({ where }),
    ]);

    return {
      trips,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Soft deletes a trip.
   */
  static async softDeleteTrip(id: string) {
    return prisma.trip.update({
      where: { id },
      data: {
        isArchived: true,
        deletedAt: new Date(),
        status: TripStatus.ARCHIVED,
      },
    });
  }

  /**
   * Gets full trip details by slug.
   */
  static async getTripBySlug(slug: string) {
    return prisma.trip.findUnique({
      where: { slug, isArchived: false, deletedAt: null },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        days: {
          orderBy: { order: "asc" },
          include: {
            activities: {
              orderBy: { order: "asc" },
            },
          },
        },
        faqs: {
          orderBy: { order: "asc" },
        },
        policies: {
          orderBy: { order: "asc" },
        },
      },
    });
  }
}
