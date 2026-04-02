export const formatChatTime = (time, type = "list") => {
  if (!time) return "";

  const messageDate = new Date(time);
  const now = new Date();

  const isToday =
    messageDate.toDateString() === now.toDateString();

  const isYesterday =
    new Date(now - 86400000).toDateString() ===
    messageDate.toDateString();

  // ================= CHAT WINDOW =================
  if (type === "chat") {
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ================= CHAT LIST =================
  const diffInMs = now - messageDate;
  const diffInMinutes = Math.floor(diffInMs / 60000);

  if (diffInMinutes < 1) return "Now";
  if (diffInMinutes < 60) return `${diffInMinutes} min`;

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) return "Yesterday";

  return messageDate.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
};