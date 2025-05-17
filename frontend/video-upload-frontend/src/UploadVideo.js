
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import external CSS

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('en');
  const [ttsAudioPath, setTtsAudioPath] = useState('');
  const [transcription, setTranscription] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleLanguageChange = (event) => {
    setTargetLang(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('⚠️ Please select a video file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/upload/?target_lang=${targetLang}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob'  // <- important to get video as blob
      });
  
      // Create a video URL from blob
      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoObjectUrl = URL.createObjectURL(videoBlob);
      setFinalVideoUrl(videoObjectUrl);
  
      setPopupMessage('✅ Video processing complete!');
      setShowPopup(true);
    } catch (err) {
      setError('❌ Error uploading or processing the video.');
      console.error(err);
    } finally {
      setLoading(false);
    }

  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="upload-container">
      <h1>AI-Based Video Language Conversion</h1>

      <div>
        <input type="file" onChange={handleFileChange} accept="video/*" />
      </div>

      <div>
        <label htmlFor="language">Select Target Language:</label>
        <select id="language" value={targetLang} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
        </select>
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading & Processing...' : 'Upload Video'}
      </button>

      {error && <p className="error">{error}</p>}

      {finalVideoUrl && (
        <div className="success-message">
          <h3>Processing Complete! 🎉</h3>

           <video width="480" controls src={finalVideoUrl}></video>
           <br />
           <a href={finalVideoUrl} download="translated_video.mp4">Download Video</a>
        </div>
       )}


      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;


// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [file, setFile] = useState(null);
//   const [targetLang, setTargetLang] = useState('en');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [progress, setProgress] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a video file');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setProgress('Starting upload...');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(
//         `http://localhost:8000/upload/?target_lang=${targetLang}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setProgress(`Uploading: ${percent}%`);
//           },
//         }
//       );

//       if (response.data.status === 'success') {
//         setResult(response.data);
//         setProgress('Processing complete!');
//       } else {
//         throw new Error(response.data.message || 'Processing failed');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'An error occurred');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <header>
//         <h1>Video Translation System</h1>
//         <p>Upload a video to translate and lip-sync</p>
//       </header>

//       <div className="upload-container">
//         <div className="form-group">
//           <label htmlFor="video-upload">Select Video:</label>
//           <input
//             id="video-upload"
//             type="file"
//             accept="video/*"
//             onChange={handleFileChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="language-select">Target Language:</label>
//           <select
//             id="language-select"
//             value={targetLang}
//             onChange={(e) => setTargetLang(e.target.value)}
//           >
//             <option value="en">English</option>
//             <option value="hi">Hindi</option>
//             <option value="es">Spanish</option>
//             <option value="fr">French</option>
//             <option value="de">German</option>
//           </select>
//         </div>

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="upload-button"
//         >
//           {loading ? 'Processing...' : 'Upload & Process'}
//         </button>

//         {progress && <div className="progress-message">{progress}</div>}
//         {error && <div className="error-message">{error}</div>}
//       </div>

//       {result && (
//         <div className="result-container">
//           <h2>Results</h2>
          
//           <div className="video-player">
//             <video controls>
//               <source src={result.video_url} type="video/mp4" />
//               <track
//                 src={result.srt_url}
//                 kind="subtitles"
//                 srcLang={targetLang}
//                 label={targetLang}
//                 default
//               />
//               Your browser does not support the video tag.
//             </video>
//           </div>

//           <div className="download-buttons">
//             <a href={result.video_url} download className="download-btn">
//               Download Video
//             </a>
//             <a href={result.srt_url} download className="download-btn">
//               Download Subtitles
//             </a>
//             <a href={result.transcript_url} download className="download-btn">
//               Download Transcript
//             </a>
//           </div>

//           <div className="text-results">
//             <div className="text-box">
//               <h3>Original Transcription</h3>
//               <p>{result.transcription}</p>
//             </div>
//             <div className="text-box">
//               <h3>Translation ({targetLang.toUpperCase()})</h3>
//               <p>{result.translation}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;