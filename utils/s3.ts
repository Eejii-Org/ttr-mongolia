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

export const uploadImagesToS3 = async (files: Blob[], path: string) => {
  if (files.length == 0) {
    return;
  }
  try {
    const promises = files.map(
      async (file) => await uploadImageToS3(file, path)
    );
    const uploadedFiles = await Promise.all(promises);
    return uploadedFiles;
    // Rewrite
    // let formData = new FormData();
    // formData.append("file", JSON.stringify(files));
    // formData.append("path", path);
    // const res = await axios.post("/api/s3-upload", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    // return res?.data?.filePath;
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
    const res = await axios.post("/api/s3-delete", {
      filePath: path,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteImagesInS3 = async (paths: string[]) => {
  try {
    const res = await axios.post("/api/s3-delete", {
      filePath: paths,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
