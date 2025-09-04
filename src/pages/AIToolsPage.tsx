import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Image as ImageIcon, 
  Mic, 
  Volume2, 
  Upload, 
  Download,
  Loader2,
  Play,
  Pause
} from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AIToolsPage = () => {
  const [imageDescription, setImageDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [sttLoading, setSttLoading] = useState(false);
  
  const [textToSpeak, setTextToSpeak] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { toast } = useToast();

  const generateImage = async () => {
    if (!imageDescription.trim()) {
      toast({
        title: 'Missing Description',
        description: 'Please provide a product description',
        variant: 'destructive'
      });
      return;
    }

    setImageLoading(true);
    
    try {
      const response = await api.generateImage(imageDescription);
      setGeneratedImage(response.imageUrl);
      
      toast({
        title: 'Image Generated!',
        description: 'Your product mockup has been created'
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive'
      });
      
      // Mock image for demo
      setGeneratedImage('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSpeechToText = async () => {
    if (!audioFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select an audio file',
        variant: 'destructive'
      });
      return;
    }

    setSttLoading(true);
    
    try {
      const response = await api.speechToText(audioFile);
      setTranscription(response.transcription);
      
      toast({
        title: 'Transcription Complete!',
        description: 'Your audio has been transcribed'
      });
    } catch (error) {
      toast({
        title: 'Transcription Failed',
        description: 'Failed to transcribe audio. Please try again.',
        variant: 'destructive'
      });
      
      // Mock transcription for demo
      setTranscription('This is a sample transcription of your audio file. The AI would normally convert your speech to text here.');
    } finally {
      setSttLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!textToSpeak.trim()) {
      toast({
        title: 'No Text Provided',
        description: 'Please enter text to convert to speech',
        variant: 'destructive'
      });
      return;
    }

    setTtsLoading(true);
    
    try {
      const response = await api.textToSpeech(textToSpeak);
      setAudioUrl(response.audioUrl);
      
      toast({
        title: 'Audio Generated!',
        description: 'Your text has been converted to speech'
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate audio. Please try again.',
        variant: 'destructive'
      });
      
      // Mock audio URL for demo
      setAudioUrl('data:audio/wav;base64,mock-audio-data');
    } finally {
      setTtsLoading(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'generated-speech.mp3';
      link.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">AI-Powered Tools</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhance your workflow with our suite of AI tools designed for artisans and entrepreneurs.
          </p>
        </div>

        {/* AI Tools Tabs */}
        <Card className="shadow-medium">
          <CardContent className="pt-6">
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="image" className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Image Generator</span>
                </TabsTrigger>
                <TabsTrigger value="stt" className="flex items-center space-x-2">
                  <Mic className="h-4 w-4" />
                  <span>Speech to Text</span>
                </TabsTrigger>
                <TabsTrigger value="tts" className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <span>Text to Speech</span>
                </TabsTrigger>
              </TabsList>

              {/* Image Generator */}
              <TabsContent value="image" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-xl mb-2">Product Mockup Generator</CardTitle>
                    <CardDescription>
                      Describe your product idea and generate a visual mockup to help visualize your concept.
                    </CardDescription>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product-description">Product Description</Label>
                      <Textarea
                        id="product-description"
                        placeholder="Describe your product in detail... (e.g., A minimalist wooden phone stand with clean lines and natural finish)"
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={generateImage}
                      disabled={imageLoading}
                      className="w-full"
                    >
                      {imageLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Image...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Generate Product Mockup
                        </>
                      )}
                    </Button>
                    
                    {generatedImage && (
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <img 
                            src={generatedImage} 
                            alt="Generated product mockup"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Speech to Text */}
              <TabsContent value="stt" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-xl mb-2">Speech to Text Converter</CardTitle>
                    <CardDescription>
                      Upload an audio file to convert speech into editable text for documentation or notes.
                    </CardDescription>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="audio-upload">Audio File</Label>
                      <Input
                        id="audio-upload"
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Supported formats: MP3, WAV, M4A, FLAC
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleSpeechToText}
                      disabled={sttLoading || !audioFile}
                      className="w-full"
                    >
                      {sttLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Convert to Text
                        </>
                      )}
                    </Button>
                    
                    {transcription && (
                      <div className="space-y-2">
                        <Label>Transcription</Label>
                        <Textarea
                          value={transcription}
                          onChange={(e) => setTranscription(e.target.value)}
                          className="min-h-[150px]"
                          placeholder="Your transcribed text will appear here..."
                        />
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export as Text File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Text to Speech */}
              <TabsContent value="tts" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-xl mb-2">Text to Speech Generator</CardTitle>
                    <CardDescription>
                      Convert your written content into natural-sounding audio for presentations or accessibility.
                    </CardDescription>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="text-input">Text to Convert</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Enter the text you want to convert to speech..."
                        value={textToSpeak}
                        onChange={(e) => setTextToSpeak(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleTextToSpeech}
                      disabled={ttsLoading || !textToSpeak.trim()}
                      className="w-full"
                    >
                      {ttsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Audio...
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 mr-2" />
                          Generate Speech
                        </>
                      )}
                    </Button>
                    
                    {audioUrl && (
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Generated Audio</span>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={playAudio}
                                  disabled={isPlaying}
                                >
                                  {isPlaying ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={downloadAudio}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIToolsPage;