import { format } from "date-fns";


export const formatDate = (date: string | Date, formatString = "MMMM dd, yyyy - hh:mm a"): string => {
  if (!date) {
    throw new Error("Invalid date provided.");
  }

  // Ensure the date is a valid Date object
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date object.");
  }

  return format(dateObj, formatString);
};
