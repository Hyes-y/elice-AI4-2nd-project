import { InputFile } from "styles/Components/CommonStyle";
import { ChangeButton } from "styles/User/UserCardStyle";
import { LABEL } from "utils/constants";
import { useRef } from "react";
import { uploadFile } from "utils/api";
import { useQueryClient } from "react-query";

/**
 * 파일 업로드 컴포넌트 입니다.
 * @param {string} type user 또는 post
 * @param {string} id 업로드 요청을 보낼 id
 * @param {string} prevImage 이전 이미지 url
 * @param {function} setShowAlert
 * @returns {JSX.Element}
 * @constructor
 */
function FileUpload({ type, id, prevImage = "", setShowAlert }) {
  const queryClient = useQueryClient();
  const refFileUpload = useRef();

  const handleUploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("filename", e.target.files[0]);
    formData.append("prevImage", prevImage);

    try {
      await uploadFile(`${type}/${id}/uploadImage`, formData);
      if (type === "users") {
        queryClient.invalidateQueries("userState");
        queryClient.invalidateQueries(["user", id]);
      }

      if (type === "posts") {
        queryClient.invalidateQueries("post");
        queryClient.invalidateQueries("posts");
      }
    } catch (err) {
      setShowAlert(true);
    }
  };

  return (
    <>
      <InputFile
        type="file"
        ref={refFileUpload}
        accept="image/*"
        onChange={handleUploadFile}
      />
      <ChangeButton onClick={() => refFileUpload.current.click()}>
        {LABEL.CHANGE_IMAGE}
      </ChangeButton>
    </>
  );
}

export default FileUpload;
