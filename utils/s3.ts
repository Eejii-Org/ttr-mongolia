import axios from "axios";

export const uploadImage = async (file: Blob, path: string) => {
  if (!file) {
    return;
  }
  try {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const res = await axios.post("/api/s3-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data?.filePath;
  } catch (e) {
    console.log(e);
  }
};

export const updateImage = async (file: Blob, path: string) => {
  if (!file) {
    return;
  }
  try {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const res = await axios.post("/api/s3-update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data?.filePath;
  } catch (e) {
    console.log(e);
  }
};

export const deleteImage = async (path: string) => {
  try {
    var formData = new FormData();
    formData.append("filePath", path);
    const res = await axios.post("/api/s3-delete", {
      filePath: path,
    });
  } catch (e) {
    console.log(e);
  }
};
