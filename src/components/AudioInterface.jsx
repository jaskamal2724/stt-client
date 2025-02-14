import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, Square, Loader, Activity, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import axios from 'axios';
import FormData from 'form-data';


const AudioInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioName, setAudioName] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);


  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
    setAudioLevel(0);
  }, [isRecording]);

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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setAudioName(file.name);
    }
  };

  const handleTranscribe = async () => {
    setIsLoading(true);

    const res = await fetch(audioURL);
    const audioBlob = await res.blob();
    const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

    const formData = new FormData()
    formData.append("audio",audioFile)

    // if (audioURL.startsWith("blob:")) {
    //   // Convert blob URL to File
    //   const response = await fetch(audioURL);
    //   const blob = await response.blob();
    //   const file = new File([blob], "audio.wav", { type: "audio/wav" });
    //   formData.append("audio", file);
    // } 
    // else {
    //   // Uploaded file case (already set in handleFileUpload)
    //   const fileInput = document.getElementById('audio-upload');
    //   if (fileInput.files.length > 0) {
    //     formData.append("audio", fileInput.files[0]);
    //   }
    // }

    console.log(audioFile)

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`,formData,{headers:{"Content-Type":"multipart/form-data"}})
    
    setTranscription(response.data.transcription);
    setIsLoading(false);
    
  };

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

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <>
    <div>
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
            
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <Button
                variant="outline"
                className="w-full sm:w-auto relative overflow-hidden group border-gray-600 hover:border-gray-500"
                onClick={() => document.getElementById('audio-upload').click()}
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out group-hover:w-full opacity-10" />
                <Upload className="mr-2 h-4 w-4" />
                Upload Audio
              </Button>
            </div>

            
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={isRecording ? stopRecording : startRecording}
              className="relative overflow-hidden group border-gray-600 hover:border-gray-500"
            >
              <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transition-all duration-300 ease-out group-hover:w-full opacity-10" />
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          
          {isRecording && (
            <div className="py-4">
              <Progress value={audioLevel} className="h-2 bg-gray-700" />
              <div className="flex justify-between mt-4 space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 "
                  />
                ))}
              </div>
            </div>
          )}

          
          {audioURL && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="py-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{audioName}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTranscribe}
                    disabled={isLoading}
                  >
                    Transcribe
                  </Button>
                </div>
                <audio
                  ref={audioPlayerRef}
                  src={audioURL}
                  onEnded={handleAudioEnded}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )}

          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-indigo-400" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] rounded-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="h-8 w-8 text-indigo-500" />
                      </div>
                    </div>
                  </div>
                ) : transcription ? (
                  <p className="text-gray-300 leading-relaxed">{transcription}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                    <Mic className="h-12 w-12 text-gray-500" />
                    <p className="text-center">
                      Upload an audio file or start recording to see transcription
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
      </div>
    </div>
    </div>
    </>
  );
};

export default AudioInterface;