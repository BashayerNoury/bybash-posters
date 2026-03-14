import { useState, useRef, useEffect } from 'react';
import { Download, Type, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import logoWhite from 'figma:asset/41d4b34d780404080e4579e1e3880a7042689b6f.png';
import logoBlack from 'figma:asset/8224804293d687b2b4a0c7b85329981d1ee2aece.png';

interface PosterConfig {
  title: string;
  subtitle: string;
  fontSize: number;
  subtitleSize: number;
  pattern: 'yinyang' | 'dots' | 'grid' | 'circles' | 'waves' | 'diagonal' | 'minimal' | 'split';
  showByBash: boolean;
  signatureType: 'text' | 'image';
}

export function LinkedInPosterCreator() {
  const lightCanvasRef = useRef<HTMLCanvasElement>(null);
  const darkCanvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<PosterConfig>({
    title: 'Quiet builds.\\nLoud outcomes.',
    subtitle: '',
    fontSize: 72,
    subtitleSize: 36,
    pattern: 'yinyang',
    showByBash: true,
    signatureType: 'text',
  });
  const [logoImages, setLogoImages] = useState<{ white: HTMLImageElement | null; black: HTMLImageElement | null }>({
    white: null,
    black: null,
  });

  // Load logo images
  useEffect(() => {
    const whiteImg = new Image();
    const blackImg = new Image();
    
    whiteImg.src = logoWhite;
    blackImg.src = logoBlack;
    
    Promise.all([
      new Promise((resolve) => { whiteImg.onload = resolve; }),
      new Promise((resolve) => { blackImg.onload = resolve; }),
    ]).then(() => {
      setLogoImages({ white: whiteImg, black: blackImg });
    });
  }, []);

  const updateConfig = (updates: Partial<PosterConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const drawPoster = (
    canvas: HTMLCanvasElement,
    isDark: boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // Colors - inverted for yin-yang effect
    const bgColor = isDark ? '#000000' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const accentColor = isDark ? '#999999' : '#666666';
    // Pattern color is OPPOSITE of background for yin-yang effect
    const patternColor = isDark ? '#FFFFFF' : '#000000';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Pattern based on config - using OPPOSITE colors
    switch (config.pattern) {
      case 'yinyang':
        ctx.save();
        ctx.globalAlpha = 0.12;
        
        // Centered yin-yang symbol
        const yyCenterX = width / 2;
        const yyCenterY = height / 2;
        const yyRadius = 280;
        
        ctx.fillStyle = patternColor;
        
        // Main circle - left half
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY, yyRadius, Math.PI * 0.5, Math.PI * 1.5);
        ctx.fill();
        
        // Large semicircle - top (yin part)
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY - yyRadius / 2, yyRadius / 2, Math.PI * 0.5, Math.PI * 1.5);
        ctx.fill();
        
        // Large semicircle - bottom (yang part) - opposite color
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY + yyRadius / 2, yyRadius / 2, Math.PI * 1.5, Math.PI * 0.5);
        ctx.fill();
        
        // Fill the right half with opposite color
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY, yyRadius, Math.PI * 1.5, Math.PI * 0.5);
        ctx.fill();
        
        // Correct the overlaps
        ctx.fillStyle = patternColor;
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY - yyRadius / 2, yyRadius / 2, Math.PI * 1.5, Math.PI * 0.5);
        ctx.fill();
        
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY + yyRadius / 2, yyRadius / 2, Math.PI * 0.5, Math.PI * 1.5);
        ctx.fill();
        
        // Small dot in top half (opposite color)
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY - yyRadius / 2, yyRadius / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Small dot in bottom half (opposite color)
        ctx.fillStyle = patternColor;
        ctx.beginPath();
        ctx.arc(yyCenterX, yyCenterY + yyRadius / 2, yyRadius / 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.restore();
        break;
      case 'dots':
        ctx.fillStyle = patternColor;
        ctx.globalAlpha = 0.15;
        const dotSpacing = 45;
        for (let x = 0; x < width; x += dotSpacing) {
          for (let y = 0; y < height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        break;
      case 'grid':
        ctx.strokeStyle = patternColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.12;
        const gridSize = 70;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        break;
      case 'circles':
        ctx.strokeStyle = patternColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.12;
        // Concentric circles from center
        for (let r = 100; r < 800; r += 100) {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        break;
      case 'waves':
        ctx.strokeStyle = patternColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.12;
        // Horizontal waves
        for (let y = 0; y < height; y += 70) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 15) {
            const waveY = y + Math.sin(x * 0.01) * 35;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        break;
      case 'diagonal':
        ctx.strokeStyle = patternColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.12;
        const diagonalSpacing = 50;
        // Diagonal lines
        for (let i = -height; i < width + height; i += diagonalSpacing) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + height, height);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        break;
      case 'minimal':
        ctx.fillStyle = patternColor;
        ctx.globalAlpha = 0.1;
        // Large scattered circles
        const circles = [
          { x: width * 0.15, y: height * 0.2, r: 200 },
          { x: width * 0.85, y: height * 0.75, r: 250 },
          { x: width * 0.6, y: height * 0.4, r: 180 },
        ];
        circles.forEach(circle => {
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        break;
      case 'split':
        ctx.save();
        ctx.globalAlpha = 0.08;
        
        // Half yin-yang split - each poster shows opposite half
        const centerX = width / 2;
        const centerY = height / 2;
        const yinYangRadius = 350;
        
        ctx.fillStyle = patternColor;
        
        if (isDark) {
          // Dark poster shows left half of a white yin-yang (yang half)
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, centerX, height);
          ctx.clip();
          
          // Main circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, yinYangRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Top small circle (yin part)
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY - yinYangRadius / 2, yinYangRadius / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Bottom small circle (yang part)
          ctx.fillStyle = patternColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY + yinYangRadius / 2, yinYangRadius / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Small dot in top circle
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY - yinYangRadius / 2, yinYangRadius / 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Small dot in bottom circle
          ctx.fillStyle = patternColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY + yinYangRadius / 2, yinYangRadius / 10, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        } else {
          // Light poster shows right half of a black yin-yang (yin half)
          ctx.save();
          ctx.beginPath();
          ctx.rect(centerX, 0, width, height);
          ctx.clip();
          
          // Main circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, yinYangRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Top small circle (yin part)
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY - yinYangRadius / 2, yinYangRadius / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Bottom small circle (yang part)
          ctx.fillStyle = patternColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY + yinYangRadius / 2, yinYangRadius / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Small dot in top circle
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY - yinYangRadius / 2, yinYangRadius / 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Small dot in bottom circle
          ctx.fillStyle = patternColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY + yinYangRadius / 2, yinYangRadius / 10, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
        
        ctx.globalAlpha = 1;
        ctx.restore();
        break;
      default:
        break;
    }

    // Title
    ctx.fillStyle = textColor;
    ctx.font = `700 ${config.fontSize}px Inter, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap for title
    const lines = config.title.split('\n');
    const wrappedLines: string[] = [];
    
    lines.forEach(line => {
      const words = line.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > width - 200 && currentLine) {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) wrappedLines.push(currentLine);
    });

    const lineHeight = config.fontSize * 1.2;
    const totalHeight = wrappedLines.length * lineHeight;
    let startY = (height - totalHeight) / 2;

    if (config.subtitle) {
      startY -= config.subtitleSize;
    }

    wrappedLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    // Subtitle
    if (config.subtitle) {
      ctx.font = `400 ${config.subtitleSize}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = accentColor;
      const subtitleY = startY + totalHeight + 60;
      
      // Word wrap for subtitle
      const subtitleWords = config.subtitle.split(' ');
      const subtitleLines: string[] = [];
      let currentSubLine = '';

      subtitleWords.forEach((word) => {
        const testLine = currentSubLine + (currentSubLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > width - 200 && currentSubLine) {
          subtitleLines.push(currentSubLine);
          currentSubLine = word;
        } else {
          currentSubLine = testLine;
        }
      });
      if (currentSubLine) subtitleLines.push(currentSubLine);

      subtitleLines.forEach((line, index) => {
        ctx.fillText(line, width / 2, subtitleY + index * (config.subtitleSize * 1.3));
      });
    }

    // "By Bash" signature at the bottom
    if (config.showByBash) {
      if (config.signatureType === 'text') {
        ctx.font = `400 28px Inter, system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = accentColor;
        ctx.textAlign = 'center';
        ctx.fillText('By Bash', width / 2, height - 60);
      } else {
        const logo = isDark ? logoImages.white : logoImages.black;
        if (logo) {
          const logoWidth = 100;
          const logoHeight = 100;
          const logoX = (width - logoWidth) / 2;
          const logoY = height - logoHeight - 20;
          ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
        }
      }
    }
  };

  useEffect(() => {
    if (lightCanvasRef.current) {
      drawPoster(lightCanvasRef.current, false);
    }
    if (darkCanvasRef.current) {
      drawPoster(darkCanvasRef.current, true);
    }
  }, [config, logoImages]);

  const downloadPoster = (isDark: boolean) => {
    const canvas = isDark ? darkCanvasRef.current : lightCanvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linkedin-poster-${isDark ? 'dark' : 'light'}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const downloadBoth = () => {
    downloadPoster(false);
    setTimeout(() => downloadPoster(true), 300);
  };

  const resetToDefault = () => {
    setConfig({
      title: 'Quiet builds.\\nLoud outcomes.',
      subtitle: '',
      fontSize: 72,
      subtitleSize: 36,
      pattern: 'yinyang',
      showByBash: true,
      signatureType: 'text',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-4">
            Yin Yang Posters
          </h1>
          <p className="text-neutral-600 text-xl">
            Two sides. One message.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Light Poster */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-white border-neutral-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">Yang ☀️</h2>
                <Button 
                  onClick={() => downloadPoster(false)} 
                  size="sm"
                  variant="outline"
                  className="border-neutral-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="border-2 border-neutral-200 rounded-lg overflow-hidden bg-white">
                <canvas ref={lightCanvasRef} className="w-full h-auto" />
              </div>
            </Card>
          </motion.div>

          {/* Dark Poster */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-neutral-900 border-neutral-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Yin 🌙</h2>
                <Button 
                  onClick={() => downloadPoster(true)} 
                  size="sm"
                  variant="outline"
                  className="border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="border-2 border-neutral-800 rounded-lg overflow-hidden bg-black">
                <canvas ref={darkCanvasRef} className="w-full h-auto" />
              </div>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-white border-neutral-200 shadow-lg sticky top-8">
              <h2 className="text-xl font-semibold text-black mb-6">Customize</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base mb-2 text-neutral-700">
                    Main Message
                  </Label>
                  <Textarea
                    id="title"
                    value={config.title}
                    onChange={(e) => updateConfig({ title: e.target.value })}
                    placeholder="Your message here"
                    className="text-lg resize-none bg-white border-neutral-300 text-black min-h-[120px]"
                    rows={5}
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Press Enter for new lines
                  </p>
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-base mb-2 text-neutral-700">
                    Author Name (Optional)
                  </Label>
                  <Input
                    id="subtitle"
                    value={config.subtitle}
                    onChange={(e) => updateConfig({ subtitle: e.target.value })}
                    placeholder="Your name"
                    className="text-base bg-white border-neutral-300 text-black"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showByBash"
                    checked={config.showByBash}
                    onCheckedChange={(checked) => updateConfig({ showByBash: checked as boolean })}
                  />
                  <Label htmlFor="showByBash" className="text-base text-neutral-700 cursor-pointer">
                    Show "By Bash" signature
                  </Label>
                </div>

                {config.showByBash && (
                  <div>
                    <Label className="text-base mb-3 text-neutral-700">
                      Signature Style
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant={config.signatureType === 'text' ? 'default' : 'outline'}
                        onClick={() => updateConfig({ signatureType: 'text' })}
                        className={
                          config.signatureType === 'text'
                            ? 'bg-black text-white hover:bg-neutral-800'
                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                        }
                        size="sm"
                      >
                        <Type className="w-4 h-4 mr-2" />
                        Text
                      </Button>
                      <Button
                        variant={config.signatureType === 'image' ? 'default' : 'outline'}
                        onClick={() => updateConfig({ signatureType: 'image' })}
                        className={
                          config.signatureType === 'image'
                            ? 'bg-black text-white hover:bg-neutral-800'
                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                        }
                        size="sm"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Logo
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-base mb-3 text-neutral-700">
                    Pattern Style
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { value: 'yinyang', label: 'Yin Yang' },
                      { value: 'dots', label: 'Dots' },
                      { value: 'grid', label: 'Grid' },
                      { value: 'circles', label: 'Circles' },
                      { value: 'waves', label: 'Waves' },
                      { value: 'diagonal', label: 'Diagonal' },
                      { value: 'minimal', label: 'Minimal' },
                      { value: 'split', label: 'Split' },
                    ].map((pattern) => (
                      <Button
                        key={pattern.value}
                        variant={config.pattern === pattern.value ? 'default' : 'outline'}
                        onClick={() => updateConfig({ pattern: pattern.value as any })}
                        className={
                          config.pattern === pattern.value
                            ? 'bg-black text-white hover:bg-neutral-800'
                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                        }
                        size="sm"
                      >
                        {pattern.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 text-neutral-700">
                    Title Size: {config.fontSize}px
                  </Label>
                  <Slider
                    value={[config.fontSize]}
                    onValueChange={([value]) => updateConfig({ fontSize: value })}
                    min={48}
                    max={120}
                    step={4}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base mb-3 text-neutral-700">
                    Subtitle Size: {config.subtitleSize}px
                  </Label>
                  <Slider
                    value={[config.subtitleSize]}
                    onValueChange={([value]) => updateConfig({ subtitleSize: value })}
                    min={24}
                    max={64}
                    step={4}
                    className="mt-2"
                  />
                </div>

                <div className="pt-4 space-y-2 border-t border-neutral-200">
                  <Button 
                    onClick={downloadBoth} 
                    className="w-full bg-black text-white hover:bg-neutral-800"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Both
                  </Button>
                  <Button 
                    onClick={resetToDefault} 
                    variant="outline"
                    className="w-full border-neutral-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 text-center">
                    1200 × 1200px
                    <br />
                    LinkedIn carousel ready
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}