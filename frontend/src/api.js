const API_URL = import.meta.env.VITE_API_URL || "";

export const getApiUrl = (path) => {
  if (!path) return API_URL;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
};

export const apiGet = async (path) => {
  const response = await fetch(getApiUrl(path));
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

export const apiPost = async (path, data) => {
  const response = await fetch(getApiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

export const getUploadUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads")) return `${API_URL}${path}`;
  if (path.startsWith("uploads")) return `${API_URL}/${path}`;
  return `${API_URL}/uploads/${path}`;
};

export { API_URL };
