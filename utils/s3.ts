import axios from "axios";

export const uploadImageToS3 = async (file: Blob, path: string) => {
  if (!file) {
    return;
  }
  try {
    let formData = new FormData();
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

export const updateImageInS3 = async (file: Blob, path: string) => {
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

export const deleteImageInS3 = async (path: string) => {
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
