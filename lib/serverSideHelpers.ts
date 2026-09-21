/**
 * Server-side helper utilities for getServerSideProps
 * Provides consistent error handling and validation across pages
 */

import type { NextApiRequest } from "next";
import type { AddressType, LocationType } from "../types/service";
import type { Session } from "next-auth";

/**
 * Validates session and ensures required user data exists
 * @param {Object} session - NextAuth session object
 * @returns {Object|null} - Returns redirect object if invalid, null if valid
 */
export function validateSession(session: Session) {
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  if (!session.user?._id) {
    console.error(
      "Session missing user._id:",
      JSON.stringify(session, null, 2),
    );
    return { redirect: { destination: "/login", permanent: false } };
  }

  return null; // Valid session
}

/**
 * Safely fetches data with error handling
 * @param {string} url - URL to fetch
 * @param {string} context - Context for error logging
 * @returns {Promise<Object|null>} - Returns parsed JSON or null on error
 */
export async function safeFetch(url: string, context = "API") {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`${context} fetch failed:`, {
        url,
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${context} fetch error:`, {
        url,
        error: error.message,
      });
      return null;
    }
    console.error(error);
    return null;
  }
}

/**
 * Gets the base URL for API calls
 * @param {Object} req - Next.js request object
 * @returns {string} - Base URL
 */
export function getBaseUrl(req: NextApiRequest) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  return req ? `${protocol}://${req.headers.host}` : "";
}

export function blankLocation() {
  return {
    address: { street: "", city: "", state: "", zip: "" },
    url: "",
    contactPhone: "",
    contactName: "",
    contactEmail: "",
    hours: "",
    notes: "",
    primary_location: false,
  };
}

export function isSameLocation(A: LocationType, B: LocationType): boolean {
  const isSame =
    A.contactEmail == B.contactEmail &&
    A.contactName == B.contactName &&
    A.hours == B.hours &&
    A.url == B.url &&
    A.notes == B.notes &&
    A.contactPhone == B.contactPhone &&
    isSameAddress(A.address, B.address);

  return isSame;
}

export function isSameAddress(A: AddressType, B: AddressType): boolean {
  const isSame =
    A.city == B.city &&
    A.state == B.state &&
    A.street == B.street &&
    A.zip == B.zip;

  return isSame;
}

export function hasAllSameLocations(
  A: LocationType[],
  B: LocationType[],
): boolean {
  if (!A && B) return false;
  if (!B && A) return false;
  if (!B && !A) return true;

  if (A.length !== B.length) {
    return false;
  }
  for (let i = 0; i < A.length; i++) {
    if (!isSameLocation(A[i], B[i])) {
      return false;
    }
  }
  return true;
}

export function stringArrayEquals(A: string[], B: string[]): boolean {
  if (!A && B) return false;
  if (!B && A) return false;
  if (!B && !A) return true;

  if (A.length !== B.length) return false;

  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) return false;
  }
  return true;
}
