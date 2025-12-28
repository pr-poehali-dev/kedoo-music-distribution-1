import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { AuthContextType } from '@/App';

interface AddReleaseProps {
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

interface Track {
  id: string;
  title: string;
  tiktokMoment: string;
  musicAuthor: string;
  lyricsAuthor: string;
  hasProfanity: boolean;
  performers: string;
  producers: string;
  isrc: string;
  language: string;
  audioFile?: File;
}

const genres = [
  'Поп', 'Рок', 'Хип-хоп', 'Рэп', 'Электронная', 'Джаз', 'Классика', 
  'R&B', 'Регги', 'Кантри', 'Блюз', 'Фолк', 'Метал', 'Панк', 'Инди'
];

const AddRelease = ({ authContext, toggleTheme, theme }: AddReleaseProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'album' | 'tracks' | 'preview'>('album');
  
  const [albumTitle, setAlbumTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [upc, setUpc] = useState('');
  const [oldReleaseDate, setOldReleaseDate] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Partial<Track>>({
    hasProfanity: false,
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 10MB');
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTrack = () => {
    if (!currentTrack.title || !currentTrack.musicAuthor || !currentTrack.lyricsAuthor || 
        !currentTrack.performers || !currentTrack.language) {
      toast.error('Заполните все обязательные поля трека');
      return;
    }

    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      title: currentTrack.title!,
      tiktokMoment: currentTrack.tiktokMoment || '',
      musicAuthor: currentTrack.musicAuthor!,
      lyricsAuthor: currentTrack.lyricsAuthor!,
      hasProfanity: currentTrack.hasProfanity || false,
      performers: currentTrack.performers!,
      producers: currentTrack.producers || '',
      isrc: currentTrack.isrc || '',
      language: currentTrack.language!,
      audioFile: currentTrack.audioFile,
    };

    setTracks([...tracks, newTrack]);
    setCurrentTrack({ hasProfanity: false });
    toast.success('Трек добавлен');
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
    toast.success('Трек удален');
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentTrack({ ...currentTrack, audioFile: file });
    }
  };

  const goToTracks = () => {
    if (!albumTitle || !artist || !genre || !coverImage) {
      toast.error('Заполните все обязательные поля альбома');
      return;
    }
    setStep('tracks');
  };

  const goToPreview = () => {
    if (tracks.length === 0) {
      toast.error('Добавьте хотя бы один трек');
      return;
    }
    setStep('preview');
  };

  const submitForModeration = () => {
    const release = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: authContext.user?.email,
      title: albumTitle,
      artist,
      genre,
      releaseDate,
      upc,
      oldReleaseDate,
      coverImage: coverPreview,
      tracks,
      status: 'moderation',
      createdAt: new Date().toISOString(),
    };

    const releases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    releases.push(release);
    localStorage.setItem('kedoo_releases', JSON.stringify(releases));

    toast.success('Релиз отправлен на модерацию!');
    navigate('/my-releases');
  };

  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Добавить релиз</h1>
          <p className="text-muted-foreground">Заполните информацию о вашем релизе</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={step === 'album' ? 'default' : 'outline'}
            className={step === 'album' ? 'gradient-primary' : ''}
            onClick={() => setStep('album')}
          >
            <Icon name="Disc3" size={18} className="mr-2" />
            Альбом
          </Button>
          <Button
            variant={step === 'tracks' ? 'default' : 'outline'}
            className={step === 'tracks' ? 'gradient-primary' : ''}
            disabled={!albumTitle || !artist || !genre || !coverImage}
          >
            <Icon name="Music" size={18} className="mr-2" />
            Треки ({tracks.length})
          </Button>
          <Button
            variant={step === 'preview' ? 'default' : 'outline'}
            className={step === 'preview' ? 'gradient-primary' : ''}
            disabled={tracks.length === 0}
          >
            <Icon name="Eye" size={18} className="mr-2" />
            Предпросмотр
          </Button>
        </div>

        {step === 'album' && (
          <Card>
            <CardHeader>
              <CardTitle>Информация об альбоме</CardTitle>
              <CardDescription>Основные данные релиза</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Название альбома *</Label>
                  <Input
                    id="title"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="Введите название"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Исполнитель *</Label>
                  <Input
                    id="artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Введите имя исполнителя"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Жанр *</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите жанр" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Дата релиза</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upc">UPC</Label>
                  <Input
                    id="upc"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                    placeholder="Код UPC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oldReleaseDate">Старая дата релиза</Label>
                  <Input
                    id="oldReleaseDate"
                    type="date"
                    value={oldReleaseDate}
                    onChange={(e) => setOldReleaseDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Обложка альбома (3000×3000) *</Label>
                <div className="flex items-start gap-4">
                  {coverPreview && (
                    <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-primary">
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Рекомендуемый размер: 3000×3000px, макс. 10MB
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={goToTracks} className="w-full gradient-primary">
                Далее: Добавить треки
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'tracks' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Добавить трек</CardTitle>
                <CardDescription>Заполните информацию о треке</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название трека *</Label>
                    <Input
                      value={currentTrack.title || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, title: e.target.value })}
                      placeholder="Название"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Аудио файл</Label>
                    <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
                  </div>
                  <div className="space-y-2">
                    <Label>ФИО автора музыки *</Label>
                    <Input
                      value={currentTrack.musicAuthor || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, musicAuthor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ФИО автора слов *</Label>
                    <Input
                      value={currentTrack.lyricsAuthor || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, lyricsAuthor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Исполнители трека *</Label>
                    <Input
                      value={currentTrack.performers || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, performers: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Продюсеры</Label>
                    <Input
                      value={currentTrack.producers || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, producers: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Язык песни *</Label>
                    <Input
                      value={currentTrack.language || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, language: e.target.value })}
                      placeholder="Русский, English, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ISRC (необязательно)</Label>
                    <Input
                      value={currentTrack.isrc || ''}
                      onChange={(e) => setCurrentTrack({ ...currentTrack, isrc: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Момент TikTok</Label>
                  <Textarea
                    value={currentTrack.tiktokMoment || ''}
                    onChange={(e) => setCurrentTrack({ ...currentTrack, tiktokMoment: e.target.value })}
                    placeholder="Опишите лучший момент для TikTok"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="profanity"
                    checked={currentTrack.hasProfanity}
                    onCheckedChange={(checked) => 
                      setCurrentTrack({ ...currentTrack, hasProfanity: checked as boolean })
                    }
                  />
                  <Label htmlFor="profanity" className="cursor-pointer">
                    В треке есть ненормативная лексика
                  </Label>
                </div>
                <Button onClick={addTrack} className="w-full">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить трек
                </Button>
              </CardContent>
            </Card>

            {tracks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Треклист ({tracks.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tracks.map((track, index) => (
                    <div key={track.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.performers}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeTrack(track.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={goToPreview} className="w-full gradient-primary">
                    Далее: Предпросмотр
                    <Icon name="ArrowRight" size={18} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 'preview' && (
          <Card>
            <CardHeader>
              <CardTitle>Предпросмотр релиза</CardTitle>
              <CardDescription>Проверьте данные перед отправкой</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                {coverPreview && (
                  <img src={coverPreview} alt="Cover" className="w-48 h-48 rounded-lg object-cover" />
                )}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">{albumTitle}</h2>
                  <p className="text-xl text-muted-foreground">{artist}</p>
                  <p className="text-sm">Жанр: {genre}</p>
                  {upc && <p className="text-sm">UPC: {upc}</p>}
                  {releaseDate && <p className="text-sm">Дата: {new Date(releaseDate).toLocaleDateString()}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Треки ({tracks.length})</h3>
                <div className="space-y-2">
                  {tracks.map((track, index) => (
                    <div key={track.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-semibold">{index + 1}. {track.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Исполнитель: {track.performers} • Язык: {track.language}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('album')} className="flex-1">
                  <Icon name="ArrowLeft" size={18} className="mr-2" />
                  Назад
                </Button>
                <Button onClick={submitForModeration} className="flex-1 gradient-primary">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить на модерацию
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AddRelease;
