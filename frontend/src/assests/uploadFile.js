import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./firebase.js";
import { useState } from "react";

export function useUploadFile() {
  const [progress, setProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState("");

  const uploadFile = async (dir, file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file?.name;
      const storageRef = ref(storage, `${dir}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progressValue = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progressValue);
          },
          (error) => reject(error),
          () => resolve()
        );
        setTimeout(() => {
          setProgress(0); // Reset progress after the upload completes
        }, 2000);
      });

      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      setImageUrl(downloadUrl);
      console.log("imageUrl in the upload:", imageUrl)
      // Return the URL for further use if needed
      return downloadUrl;
    } catch (error) {
      console.error("Upload failed", error);
      throw error;
    }
  };

  return { uploadFile, progress, imageUrl };
}
