import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ButtonPrimary from '../ButtonPrimary';
import axios from 'axios';

function FileUpload({ setContent, pubblicAddress }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayUrl, setDisplayUrl] = useState(null);
  const [algoName, setAlgoName] = useState('');
  const [dataName, setDataName] = useState('');

  function getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    // JavaScript months are 0-based.
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAlgo = await axios.post(
      `http://localhost:8000/api/users/${pubblicAddress}/algo`,
      {
        name: algoName,
      }
    );

    const fileName = `${getFormattedTime()}`;
    const fileExtension = selectedFile.name.split('.').pop();
    let formdata = new FormData();
    formdata.append('logBlob', selectedFile, `${fileName}.${fileExtension}`);
    formdata.append('algorithmId', newAlgo.data._id);
    formdata.append('dataName', dataName);

    const httpRequestOptions = {
      url: `http://localhost:8000/api/users/${newAlgo.data.userId}/jobs`,
      method: 'POST',
      data: formdata,
      headers: new Headers({
        enctype: 'multipart/form-data',
      }),
    };

    await axios(httpRequestOptions)
      .then((response) => {
        setContent(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setDisplayUrl({
      file: URL.createObjectURL(e.target.files[0]),
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setDisplayUrl({
      file: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="text-xl border-md shadow-xl text-center border rounded-sm p-6 m-6 w-2/5 min-w-min">
      <form>
        <div className="flex flex-col table-fixed">
          Job name:
          <label>
            <input
              className="border-4 m-4 w-9/12"
              type="text"
              name="Job name"
            />
          </label>
          Data name:
          <label>
            <input
              className="border-4 m-4 w-9/12"
              type="text"
              name="Data name"
              onChange={(e) => setDataName(e.target.value)}
              value={dataName}
            />
          </label>
          Algorithm name:
          <label>
            <input
              className="border-4 m-4 w-9/12"
              type="text"
              name="Algorithm name"
              onChange={(e) => setAlgoName(e.target.value)}
              value={algoName}
            />
          </label>
        </div>
        <div {...getRootProps({ className: 'p-6 m-6 border-2' })}>
          <input {...getInputProps()} onChange={handleSelect} />
          <p>Drag 'n' drop log file here or</p>
          <button
            type="button"
            className="bg-bgreylight m-6 text-white py-2 px-6 font-semibold rounded transform hover:-translate-y-0.5 duration-300 "
            onClick={open}
          >
            Open File Dialog
          </button>
        </div>
      </form>
      {displayUrl && (
        <iframe
          src={displayUrl.file}
          title="file preview"
          className="w-full"
          height="600px"
        />
      )}
      {displayUrl && (
        <div className="m-6">
          {' '}
          <ButtonPrimary function={handleSubmit} name="Submit" />{' '}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
