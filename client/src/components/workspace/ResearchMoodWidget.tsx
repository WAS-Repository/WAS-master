import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Sun, 
  Moon, 
  Coffee, 
  Music, 
  Volume2, 
  VolumeX,
  Clock,
  MessageSquare,
  BookOpen,
  Code,
  Settings
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// Research moods with their settings and descriptions
export interface ResearchMood {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: {
    lightMode: boolean;
    brightness: number; // 0-100
    volume: number; // 0-100
    focusMode: boolean;
    notifications: boolean;
    ambientSounds: string; // 'none', 'rainfall', 'whitenoise', 'lofi', 'nature'
    fontScale: number; // 0.8-1.5
    layoutDensity: 'compact' | 'comfortable' | 'spacious';
    colorTheme: 'tron' | 'matrix' | 'modern' | 'sepia' | 'classic';
  };
  vscodeSettings?: {
    workbench: {
      colorTheme: string;
      iconTheme?: string;
      editor?: {
        fontFamily?: string;
        fontSize?: number;
        lineHeight?: number;
      };
      zenMode?: {
        enabled: boolean;
        hideLineNumbers?: boolean;
      };
    };
  };
}

// Predefined research moods
const predefinedMoods: ResearchMood[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: 'Minimalist environment with reduced distractions for deep research sessions',
    icon: <Brain size={18} />,
    settings: {
      lightMode: false,
      brightness: 40,
      volume: 15,
      focusMode: true,
      notifications: false,
      ambientSounds: 'whitenoise',
      fontScale: 1.1,
      layoutDensity: 'comfortable',
      colorTheme: 'tron',
    },
    vscodeSettings: {
      workbench: {
        colorTheme: 'GitHub Dark',
        editor: {
          fontFamily: 'Consolas, monospace',
          fontSize: 14,
          lineHeight: 1.6,
        },
        zenMode: {
          enabled: true,
          hideLineNumbers: true,
        },
      },
    },
  },
  {
    id: 'creative-exploration',
    name: 'Creative Exploration',
    description: 'Vibrant, energizing setup for exploratory research and ideation',
    icon: <Sun size={18} />,
    settings: {
      lightMode: true,
      brightness: 80,
      volume: 40,
      focusMode: false,
      notifications: true,
      ambientSounds: 'lofi',
      fontScale: 1.0,
      layoutDensity: 'spacious',
      colorTheme: 'modern',
    },
    vscodeSettings: {
      workbench: {
        colorTheme: 'Atom One Light',
        iconTheme: 'material-icon-theme',
        editor: {
          fontFamily: 'Fira Code, monospace',
          fontSize: 15,
        },
        zenMode: {
          enabled: false,
        },
      },
    },
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Low-light, eye-friendly setup for late night research sessions',
    icon: <Moon size={18} />,
    settings: {
      lightMode: false,
      brightness: 30,
      volume: 20,
      focusMode: false,
      notifications: false,
      ambientSounds: 'rainfall',
      fontScale: 1.2,
      layoutDensity: 'comfortable',
      colorTheme: 'matrix',
    },
    vscodeSettings: {
      workbench: {
        colorTheme: 'Night Owl',
        editor: {
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14,
          lineHeight: 1.7,
        },
      },
    },
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Structured layout optimized for data-heavy research and analysis',
    icon: <Code size={18} />,
    settings: {
      lightMode: true,
      brightness: 70,
      volume: 0,
      focusMode: true,
      notifications: false,
      ambientSounds: 'none',
      fontScale: 0.9,
      layoutDensity: 'compact',
      colorTheme: 'classic',
    },
    vscodeSettings: {
      workbench: {
        colorTheme: 'Solarized Light',
        iconTheme: 'vscode-icons',
        editor: {
          fontFamily: 'Source Code Pro, monospace',
          fontSize: 13,
          lineHeight: 1.5,
        },
      },
    },
  },
  {
    id: 'reading-intensive',
    name: 'Reading Intensive',
    description: 'Eye-friendly setup optimized for long document reading sessions',
    icon: <BookOpen size={18} />,
    settings: {
      lightMode: true,
      brightness: 60,
      volume: 10,
      focusMode: true,
      notifications: false,
      ambientSounds: 'nature',
      fontScale: 1.3,
      layoutDensity: 'spacious',
      colorTheme: 'sepia',
    },
    vscodeSettings: {
      workbench: {
        colorTheme: 'Quiet Light',
        editor: {
          fontFamily: 'Georgia, serif',
          fontSize: 16,
          lineHeight: 1.8,
        },
        zenMode: {
          enabled: true,
        },
      },
    },
  },
];

// Generate VSCode workspace file content
export const generateWorkspaceFile = (mood: ResearchMood) => {
  const workspaceConfig = {
    folders: [
      {
        path: '.'
      }
    ],
    settings: {
      ...mood.vscodeSettings,
      'window.title': `${mood.name} Research Environment`,
      'window.autoDetectColorScheme': false,
      'workbench.preferredDarkColorTheme': mood.settings.lightMode ? undefined : mood.vscodeSettings?.workbench.colorTheme,
      'workbench.preferredLightColorTheme': mood.settings.lightMode ? mood.vscodeSettings?.workbench.colorTheme : undefined,
      'editor.fontFamily': mood.vscodeSettings?.workbench.editor?.fontFamily || 'monospace',
      'editor.fontSize': mood.vscodeSettings?.workbench.editor?.fontSize || 14,
      'editor.lineHeight': mood.vscodeSettings?.workbench.editor?.lineHeight || 1.5,
      'zenMode.fullScreen': mood.vscodeSettings?.workbench.zenMode?.enabled || false,
      'zenMode.hideLineNumbers': mood.vscodeSettings?.workbench.zenMode?.hideLineNumbers || false,
      'zenMode.hideStatusBar': mood.vscodeSettings?.workbench.zenMode?.enabled || false,
      'editor.minimap.enabled': !mood.settings.focusMode,
      'notifications.enabled': mood.settings.notifications,
      'window.zoomLevel': Math.log(mood.settings.fontScale) / Math.log(1.1), // Convert to VS Code zoom level
      'workbench.layoutControl.enabled': !mood.settings.focusMode,
      'workbench.activityBar.visible': !mood.settings.focusMode,
      'breadcrumbs.enabled': !mood.settings.focusMode,
      'editor.renderWhitespace': mood.settings.focusMode ? 'none' : 'selection',
      'workbench.colorCustomizations': {
        'editor.background': mood.settings.lightMode ? 
          `rgba(255, 255, 255, ${mood.settings.brightness/100})` : 
          `rgba(30, 30, 30, ${mood.settings.brightness/100})`,
      }
    },
    extensions: {
      recommendations: [
        'github.github-vscode-theme',
        'pkief.material-icon-theme',
        'sdras.night-owl',
        'akamud.vscode-theme-onedark',
        'wesbos.theme-cobalt2',
        'vscode-icons-team.vscode-icons'
      ]
    }
  };
  
  return JSON.stringify(workspaceConfig, null, 2);
};

// Helper function to apply workspace settings
const applyWorkspaceSettings = (mood: ResearchMood) => {
  // In a real app, this would interact with VSCode or apply settings
  // For now, we'll just generate the file and make it available for download
  const workspaceJson = generateWorkspaceFile(mood);
  const blob = new Blob([workspaceJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${mood.id}-research-workspace.code-workspace`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
};

// Helper function to simulate changing ambient sound
const playAmbientSound = (soundType: string) => {
  console.log(`Playing ambient sound: ${soundType}`);
  // In a real implementation, this would play actual sounds
};

interface ResearchMoodWidgetProps {
  onMoodChange?: (mood: ResearchMood) => void;
  className?: string;
}

export default function ResearchMoodWidget({ onMoodChange, className = '' }: ResearchMoodWidgetProps) {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('deep-focus');
  const [customizing, setCustomizing] = useState(false);
  const [currentMood, setCurrentMood] = useState<ResearchMood>(predefinedMoods[0]);
  
  // Find the selected mood when the selection changes
  useEffect(() => {
    const selectedMood = predefinedMoods.find(mood => mood.id === selectedMoodId);
    if (selectedMood) {
      setCurrentMood(selectedMood);
      if (onMoodChange) {
        onMoodChange(selectedMood);
      }
      
      // Apply appropriate ambient sound
      if (selectedMood.settings.volume > 0 && selectedMood.settings.ambientSounds !== 'none') {
        playAmbientSound(selectedMood.settings.ambientSounds);
      }
    }
  }, [selectedMoodId, onMoodChange]);
  
  // Handle customizing settings
  const handleSettingChange = (settingPath: string, value: any) => {
    setCurrentMood(prev => {
      const updated = { ...prev };
      
      // Parse the path and update the nested property
      const paths = settingPath.split('.');
      let current: any = updated;
      
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      
      return updated;
    });
  };
  
  // Export workspace settings
  const handleExportWorkspace = () => {
    applyWorkspaceSettings(currentMood);
  };
  
  return (
    <Card className={`${className} bg-opacity-90 dark:bg-opacity-90 shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-primary" />
            <CardTitle>Research Mood</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCustomizing(!customizing)}
          >
            <Settings size={16} className="mr-1" />
            {customizing ? 'Simple' : 'Customize'}
          </Button>
        </div>
        <CardDescription>
          Optimize your work environment for different research tasks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!customizing ? (
          // Simple mode with preset selection
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mood-select">Select research mood</Label>
              <Select 
                value={selectedMoodId} 
                onValueChange={setSelectedMoodId}
              >
                <SelectTrigger id="mood-select" className="w-full">
                  <SelectValue placeholder="Select a mood" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedMoods.map(mood => (
                    <SelectItem key={mood.id} value={mood.id}>
                      <div className="flex items-center gap-2">
                        {mood.icon}
                        <span>{mood.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-secondary/20 rounded-md p-3 text-sm">
              <div className="flex items-start gap-2">
                {currentMood.icon}
                <div>
                  <p className="font-medium">{currentMood.name}</p>
                  <p className="text-muted-foreground text-xs mt-1">{currentMood.description}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                {currentMood.settings.lightMode ? <Sun size={16} /> : <Moon size={16} />}
                <span className="text-xs">{currentMood.settings.lightMode ? 'Light mode' : 'Dark mode'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {currentMood.settings.ambientSounds !== 'none' ? 
                  <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="text-xs capitalize">
                  {currentMood.settings.ambientSounds === 'none' ? 
                    'No sound' : currentMood.settings.ambientSounds}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span className="text-xs">
                  {currentMood.settings.notifications ? 'Notifications on' : 'Notifications off'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Brain size={16} />
                <span className="text-xs">
                  {currentMood.settings.focusMode ? 'Focus mode on' : 'Standard mode'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Advanced customization mode
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="theme-mode">Display Mode</Label>
                <div className="flex items-center gap-2">
                  <Moon size={15} />
                  <Switch 
                    id="theme-mode" 
                    checked={currentMood.settings.lightMode}
                    onCheckedChange={(checked) => handleSettingChange('settings.lightMode', checked)}
                  />
                  <Sun size={15} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="brightness">Brightness</Label>
                  <span className="text-xs">{currentMood.settings.brightness}%</span>
                </div>
                <Slider 
                  id="brightness"
                  min={10} 
                  max={100} 
                  step={5}
                  value={[currentMood.settings.brightness]}
                  onValueChange={([value]) => handleSettingChange('settings.brightness', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-1" htmlFor="volume">
                    <Volume2 size={15} />
                    Volume
                  </Label>
                  <span className="text-xs">{currentMood.settings.volume}%</span>
                </div>
                <Slider 
                  id="volume"
                  min={0} 
                  max={100} 
                  step={5}
                  value={[currentMood.settings.volume]}
                  onValueChange={([value]) => handleSettingChange('settings.volume', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ambient-sound">Ambient Sound</Label>
                <Select 
                  value={currentMood.settings.ambientSounds} 
                  onValueChange={(value) => handleSettingChange('settings.ambientSounds', value)}
                >
                  <SelectTrigger id="ambient-sound">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No sound</SelectItem>
                    <SelectItem value="rainfall">Rainfall</SelectItem>
                    <SelectItem value="whitenoise">White Noise</SelectItem>
                    <SelectItem value="lofi">Lo-fi Music</SelectItem>
                    <SelectItem value="nature">Nature Sounds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="focus-mode">Focus Mode</Label>
                <Switch 
                  id="focus-mode" 
                  checked={currentMood.settings.focusMode}
                  onCheckedChange={(checked) => handleSettingChange('settings.focusMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={currentMood.settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('settings.notifications', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-scale">Font Scale</Label>
                  <span className="text-xs">{currentMood.settings.fontScale.toFixed(1)}x</span>
                </div>
                <Slider 
                  id="font-scale"
                  min={0.8} 
                  max={1.5} 
                  step={0.1}
                  value={[currentMood.settings.fontScale]}
                  onValueChange={([value]) => handleSettingChange('settings.fontScale', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color-theme">Color Theme</Label>
                <Select 
                  value={currentMood.settings.colorTheme} 
                  onValueChange={(value) => handleSettingChange('settings.colorTheme', value as any)}
                >
                  <SelectTrigger id="color-theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tron">Tron</SelectItem>
                    <SelectItem value="matrix">Matrix</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="layout-density">Layout Density</Label>
                <Select 
                  value={currentMood.settings.layoutDensity} 
                  onValueChange={(value) => handleSettingChange('settings.layoutDensity', value as any)}
                >
                  <SelectTrigger id="layout-density">
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => {
            const selectedMood = predefinedMoods.find(mood => mood.id === selectedMoodId);
            if (selectedMood) {
              setCurrentMood(selectedMood);
            }
          }}
        >
          Reset
        </Button>
        <Button 
          onClick={handleExportWorkspace}
          className="flex items-center gap-1"
        >
          <Code size={16} /> Export VS Code Workspace
        </Button>
      </CardFooter>
    </Card>
  );
}