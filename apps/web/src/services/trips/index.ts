import { prisma } from "@/lib/prisma";
import { Prisma, TripStatus, TripVisibility, PolicyType } from "@prisma/client";

/**
 * Service to handle Trip-related business logic and database operations.
 */
export class TripService {
  /**
   * Generates a unique slug for a trip based on its title.
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
   * Creates a new trip draft with minimal information.
   */
  static async createTripDraft(data: {
    title: string;
    location: string | null;
    categoryId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    capacity: number | null;
    price: number | null;
    advanceAmount: number | null;
    shortDesc: string | null;
  }) {
    const slug = await this.generateUniqueSlug(data.title);

    return prisma.trip.create({
      data: {
        title: data.title,
        slug,
        location: data.location,
        categoryId: data.categoryId,
        startDate: data.startDate,
        endDate: data.endDate,
        capacity: data.capacity,
        price: data.price,
        advanceAmount: data.advanceAmount,
        shortDesc: data.shortDesc,
        status: TripStatus.DRAFT,
      },
    });
  }

  /**
   * Duplicates a trip and its relationships (excluding bookings, reviews, analytics).
   */
  static async duplicateTrip(id: string) {
    const sourceTrip = await prisma.trip.findUnique({
      where: { id },
      include: {
        images: true,
        days: { include: { activities: true } },
        faqs: true,
        policies: true,
      },
    });

    if (!sourceTrip) throw new Error("Trip not found");

    const newTitle = `${sourceTrip.title} (Copy)`;
    const newSlug = await this.generateUniqueSlug(newTitle);

    return prisma.trip.create({
      data: {
        ...sourceTrip,
        id: undefined,
        title: newTitle,
        slug: newSlug,
        status: TripStatus.DRAFT,
        isArchived: false,
        deletedAt: null,
        deletedBy: null,
        viewCount: 0,
        bookingClicks: 0,
        favoriteCount: 0,
        bookingStarted: 0,
        bookingCompleted: 0,
        paymentSuccess: 0,
        paymentFailure: 0,
        couponApplied: 0,
        couponFailed: 0,
        createdAt: undefined,
        updatedAt: undefined,
        images: {
          create: sourceTrip.images.map(img => ({
            url: img.url,
            isCover: img.isCover,
            order: img.order,
            altText: img.altText,
            caption: img.caption,
            width: img.width,
            height: img.height,
            mimeType: img.mimeType,
            size: img.size,
          }))
        },
        faqs: {
          create: sourceTrip.faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer,
            order: faq.order
          }))
        },
        policies: {
          create: sourceTrip.policies.map(policy => ({
            type: policy.type,
            title: policy.title,
            description: policy.description,
            order: policy.order
          }))
        },
        days: {
          create: sourceTrip.days.map(day => ({
            title: day.title,
            order: day.order,
            activities: {
              create: day.activities.map(act => ({
                title: act.title,
                time: act.time,
                location: act.location,
                description: act.description,
                meals: act.meals,
                transportation: act.transportation,
                accommodation: act.accommodation,
                order: act.order
              }))
            }
          }))
        }
      }
    });
  }

  // --- Update Methods for Tabs ---

  static async updateTripOverview(id: string, data: Partial<Prisma.TripUpdateInput>) {
    return prisma.trip.update({ where: { id }, data });
  }

  static async updateTripSettings(id: string, data: Partial<Prisma.TripUpdateInput>) {
    return prisma.trip.update({ where: { id }, data });
  }

  static async updateTripSEO(id: string, data: Partial<Prisma.TripUpdateInput>) {
    return prisma.trip.update({ where: { id }, data });
  }

  static async updateTripPricing(id: string, data: Partial<Prisma.TripUpdateInput>) {
    return prisma.trip.update({ where: { id }, data });
  }

  static async updateTripFAQs(id: string, faqs: { question: string; answer: string; order: number }[]) {
    return prisma.$transaction(async (tx) => {
      await tx.fAQ.deleteMany({ where: { tripId: id } });
      if (faqs.length > 0) {
        await tx.fAQ.createMany({
          data: faqs.map(f => ({ ...f, tripId: id }))
        });
      }
    });
  }

  static async updateTripPolicies(id: string, policies: { type: PolicyType; title: string | null; description: string; order: number }[]) {
    return prisma.$transaction(async (tx) => {
      await tx.cancellationPolicy.deleteMany({ where: { tripId: id } });
      if (policies.length > 0) {
        await tx.cancellationPolicy.createMany({
          data: policies.map(p => ({ ...p, tripId: id }))
        });
      }
    });
  }

  static async updateTripItinerary(id: string, days: any[]) {
    return prisma.$transaction(async (tx) => {
      // Hard replace strategy for simplicity
      await tx.day.deleteMany({ where: { tripId: id } });
      for (const day of days) {
        await tx.day.create({
          data: {
            tripId: id,
            title: day.title,
            order: day.order,
            activities: {
              create: day.activities.map((act: any) => ({
                title: act.title,
                time: act.time,
                location: act.location,
                description: act.description,
                meals: act.meals,
                transportation: act.transportation,
                accommodation: act.accommodation,
                order: act.order
              }))
            }
          }
        });
      }
    });
  }

  static async updateTripGallery(id: string, images: { url: string; isCover: boolean; order: number; altText?: string; caption?: string; width?: number; height?: number; mimeType?: string; size?: number }[]) {
    return prisma.$transaction(async (tx) => {
      await tx.tripImage.deleteMany({ where: { tripId: id } });
      if (images.length > 0) {
        await tx.tripImage.createMany({
          data: images.map(img => ({ ...img, tripId: id }))
        });
      }
    });
  }

  /**
   * Validates a trip for publishing.
   * Returns validation errors if missing required fields.
   */
  static async validateTripForPublishing(id: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        images: true,
        days: true,
        policies: true,
        faqs: true,
      }
    });

    if (!trip) throw new Error("Trip not found");

    const errors: string[] = [];

    if (!trip.images.some(img => img.isCover)) errors.push("Cover image is missing.");
    if (trip.images.length === 0) errors.push("Gallery contains no images.");
    if (!trip.slug) errors.push("Slug is missing.");
    if (trip.days.length === 0) errors.push("Itinerary must contain at least one day.");
    if (!trip.price) errors.push("Base price is required.");
    if (!trip.startDate || !trip.endDate) errors.push("Start and end dates are required.");
    if (trip.startDate && trip.endDate && trip.startDate > trip.endDate) errors.push("Start date cannot be after end date.");
    if (!trip.capacity || trip.capacity <= 0) errors.push("Capacity must be greater than 0.");
    if (trip.policies.length === 0) errors.push("At least one policy is required.");
    if (!trip.seoTitle) errors.push("SEO Title is missing.");
    if (!trip.seoDescription) errors.push("SEO Description is missing.");
    if (!trip.bookingEnabled) errors.push("Booking must be enabled to publish (or set it in settings).");

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Soft deletes a trip (Archive).
   */
  static async archiveTrip(id: string, adminId: string) {
    return prisma.trip.update({
      where: { id },
      data: {
        isArchived: true,
        deletedAt: new Date(),
        deletedBy: adminId,
        status: TripStatus.ARCHIVED,
      },
    });
  }

  /**
   * Restores an archived trip.
   */
  static async restoreTrip(id: string) {
    return prisma.trip.update({
      where: { id },
      data: {
        isArchived: false,
        deletedAt: null,
        deletedBy: null,
        status: TripStatus.DRAFT,
      },
    });
  }

  /**
   * Hard deletes a trip. Only allowed if no bookings or payments exist.
   */
  static async hardDeleteTrip(id: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!trip) throw new Error("Trip not found");

    if (trip._count.bookings > 0) {
      throw new Error("Cannot hard delete a trip that has existing bookings. Please archive it instead.");
    }

    return prisma.trip.delete({ where: { id } });
  }

  /**
   * Search and filter trips (Admin List).
   */
  static async searchTrips(params: {
    query?: string;
    categoryId?: string;
    status?: TripStatus | TripStatus[];
    page?: number;
    limit?: number;
    orderBy?: "newest" | "oldest" | "upcoming" | "revenue" | "most_booked";
    isArchived?: boolean;
  }) {
    const {
      query,
      categoryId,
      status,
      page = 1,
      limit = 10,
      orderBy = "newest",
      isArchived,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.TripWhereInput = {};

    if (isArchived !== undefined) {
      where.isArchived = isArchived;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
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

    let orderByQuery: Prisma.TripOrderByWithRelationInput | Prisma.TripOrderByWithRelationInput[] = {};
    switch (orderBy) {
      case "oldest":
        orderByQuery = { createdAt: "asc" };
        break;
      case "upcoming":
        orderByQuery = { startDate: "asc" };
        break;
      case "most_booked":
        orderByQuery = { bookingCompleted: "desc" };
        break;
      case "revenue":
        orderByQuery = { paymentSuccess: "desc" }; // Simplified heuristic for sorting
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
          _count: {
            select: { bookings: true }
          }
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
   * Gets full trip details by slug or ID for the admin editor.
   */
  static async getTripForEditor(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        days: { 
          orderBy: { order: "asc" },
          include: {
            activities: { orderBy: { order: "asc" } }
          }
        },
        faqs: { orderBy: { order: "asc" } },
        policies: { orderBy: { order: "asc" } }
      }
    });
  }

  static async getTripBySlug(slug: string) {
    return prisma.trip.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        days: { 
          orderBy: { order: "asc" },
          include: {
            activities: { orderBy: { order: "asc" } }
          }
        },
        faqs: { orderBy: { order: "asc" } },
        policies: { orderBy: { order: "asc" } }
      }
    });
  }
}
