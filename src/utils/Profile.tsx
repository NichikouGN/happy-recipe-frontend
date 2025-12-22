import { Toast } from "../stores/toastStore";

const copyToClipboard = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // Prevent keyboard from showing
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export const handleUIDShare = async (text: string) => {
  copyToClipboard(text);
  Toast({
    type: "info",
    title: "Share",
    message: "Copied UID to clipboard",
  });
};
