export const formatChat = (time) => {
  if (!time) return "";

  const messageDate = new Date(time);
  const now = new Date();

  const isToday =
    messageDate.toDateString() === now.toDateString();

  const isYesterday =
    new Date(now - 86400000).toDateString() ===
    messageDate.toDateString();

  if (isToday) return "Today";   
  if (isYesterday) return "Yesterday";

  return messageDate.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};