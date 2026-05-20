// utils/imageHelper.js

import { getUploadUrl } from "../api";

const DEFAULT_AVATAR = getUploadUrl(
  "/uploads/avatars/avatar-1764958251284-210153801.png"
);
const DEFAULT_EVENT_IMAGE = "/default-event.png";

/**
 * Chuyển đổi path avatar từ database thành URL đầy đủ
 * @param {string} avatarPath - Path avatar từ database
 * @returns {string} - URL đầy đủ để hiển thị avatar
 */
export const getAvatarUrl = (avatarPath) => {
  // Nếu không có avatar
  if (!avatarPath) {
    return DEFAULT_AVATAR;
  }

  // Nếu đã là URL đầy đủ (http/https)
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }

  return getUploadUrl(avatarPath);
};

/**
 * Chuyển đổi path từ database thành URL đầy đủ để hiển thị ảnh
 * @param {string} path - Path từ database (có thể là /uploads/..., uploads/..., hoặc URL đầy đủ)
 * @returns {string} - URL đầy đủ để hiển thị ảnh
 */
export const getImageUrl = (path) => {
  // Nếu không có path hoặc là ảnh mặc định
  if (!path || path === "default-event-image.jpg") {
    return DEFAULT_EVENT_IMAGE;
  }

  // Nếu đã là URL đầy đủ (http/https)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return getUploadUrl(path);
};

/**
 * Render mô tả với các ảnh gallery được thay thế placeholder
 * @param {string} description - Nội dung mô tả HTML
 * @param {Array<string>} galleryImages - Mảng các path ảnh gallery
 * @returns {string} - HTML đã được xử lý
 */
export const renderDescriptionWithImages = (description, galleryImages) => {
  if (!description) return "";

  let html = description;

  if (Array.isArray(galleryImages)) {
    galleryImages.forEach((img, index) => {
      const realUrl = getImageUrl(img);
      const placeholder = `[IMAGE_PLACEHOLDER_${index}]`;
      const imgTag = `<div style="text-align: center; margin: 20px 0;"><img src="${realUrl}" style="max-width:100%; height:auto; border-radius:8px;" alt="Gallery image ${
        index + 1
      }" /></div>`;
      html = html.replaceAll(placeholder, imgTag);
    });
  }

  return html;
};

export default {
  getAvatarUrl,
  getImageUrl,
  renderDescriptionWithImages,
};
