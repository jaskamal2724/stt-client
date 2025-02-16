import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, Square, Loader, Activity, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import axios from 'axios';
import FormData from 'form-data';

const AudioInterface = () => {
  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioName, setAudioName] = useState('');

  // Refs for handling media recording and audio playback
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  // Effect to simulate audio level changes when recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
    setAudioLevel(0);
  }, [isRecording]);

  // Function to start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioName('Recorded Audio');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setAudioName(file.name);
    }
  };

  // Function to send audio file to backend for transcription
  const handleTranscribe = async () => {
    setIsLoading(true);

    // Fetch the audio file from the stored URL
    const res = await fetch(audioURL);
    const audioBlob = await res.blob();
    const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

    const formData = new FormData();
    formData.append("audio", audioFile);

    console.log(audioFile);

    try {
      // Sending the audio file to the backend for transcription
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("API Response:", response.data);

      // Setting the transcribed text received from the backend
      setTranscription(response.data);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle play/pause audio
  const togglePlayPause = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Function to handle audio playback completion
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="pt-40 px-6 pb-6">
        <Card className="max-w-2xl mx-auto bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Audio Transcription
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {/* Upload Audio Button */}
              <Button onClick={() => document.getElementById('audio-upload').click()}>Upload Audio</Button>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audio-upload" />

              {/* Start/Stop Recording Button */}
              <Button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </div>

            {/* Show Progress Bar when Recording */}
            {isRecording && <Progress value={audioLevel} className="h-2 bg-gray-700" />}

            {/* Show Audio Player if Audio is Available */}
            {audioURL && (
              <Card>
                <CardContent>
                  <div className="flex items-center">
                    <Button onClick={togglePlayPause}>{isPlaying ? <Pause /> : <Play />}</Button>
                    <p>{audioName}</p>
                    <Button onClick={handleTranscribe} disabled={isLoading}>Transcribe</Button>
                  </div>
                  <audio ref={audioPlayerRef} src={audioURL} onEnded={handleAudioEnded} className="hidden" />
                </CardContent>
              </Card>
            )}

            {/* Display Transcription Result */}
            <Card>
              <CardHeader>
                <CardTitle>Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Loader /> : transcription ? <p>{transcription}</p> : <p>No transcription available</p>}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioInterface;
