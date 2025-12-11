import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

interface Playlist {
  title: string;
  artist: string;
  url: string;
  duration?: string;
}

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  isPlaying = false;
  currentTrackIndex = 0;
  currentTime = 0;
  duration = 0;
  volume = 100;
  isMuted = false;
  isLoop = false;
  isShuffle = false;

  playlist: Playlist[] = [
    {
      title: 'Summer Vibes',
      artist: 'The Sound Collective',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: '3:45'
    },
    {
      title: 'Midnight Dreams',
      artist: 'Luna Echo',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: '4:12'
    },
    {
      title: 'Electric Pulse',
      artist: 'Neon Waves',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      duration: '3:28'
    },
    {
      title: 'Ocean Breeze',
      artist: 'Coastal Harmony',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: '4:05'
    },
    {
      title: 'Mountain Echo',
      artist: 'Alpine Sound',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      duration: '3:50'
    }
  ];

  audioElement: HTMLAudioElement | null = null;

  ngOnInit() {
    this.initializeAudio();
  }

  initializeAudio() {
    this.audioElement = new Audio();
    this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
    this.audioElement.addEventListener('ended', () => this.nextTrack());
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration = this.audioElement?.duration || 0;
    });
  }

  playPause() {
    if (!this.audioElement) return;

    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      if (this.audioElement.src !== this.playlist[this.currentTrackIndex].url) {
        this.audioElement.src = this.playlist[this.currentTrackIndex].url;
      }
      this.audioElement.play().catch(err => console.error('Play error:', err));
    }
    this.isPlaying = !this.isPlaying;
  }

  nextTrack() {
    if (this.isShuffle) {
      this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    }
    this.currentTime = 0;
    if (this.isPlaying) {
      this.playTrack();
    }
  }

  previousTrack() {
    if (this.currentTime > 3) {
      this.currentTime = 0;
      if (this.audioElement) {
        this.audioElement.currentTime = 0;
      }
    } else {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
      this.currentTime = 0;
      if (this.isPlaying) {
        this.playTrack();
      }
    }
  }

  playTrack() {
    if (!this.audioElement) return;
    this.audioElement.src = this.playlist[this.currentTrackIndex].url;
    this.audioElement.play().catch(err => console.error('Play error:', err));
    this.isPlaying = true;
  }

  selectTrack(index: number) {
    this.currentTrackIndex = index;
    this.currentTime = 0;
    this.playTrack();
  }

  updateProgress() {
    if (this.audioElement) {
      this.currentTime = this.audioElement.currentTime;
    }
  }

  onProgressChange(value: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = value;
      this.currentTime = value;
    }
  }

  onProgressChangeClick(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const offsetX = (event as any).offsetX;
    const width = element.offsetWidth;
    const time = (offsetX / width) * this.duration;
    this.onProgressChange(time);
  }

  onVolumeChange(value: number) {
    this.volume = value;
    if (this.audioElement) {
      this.audioElement.volume = value / 100;
    }
  }

  onVolumeChangeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseInt(target.value, 10);
    this.onVolumeChange(newVolume);
  }

  toggleMute() {
    if (!this.audioElement) return;
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;
  }

  toggleLoop() {
    this.isLoop = !this.isLoop;
    if (this.audioElement) {
      this.audioElement.loop = this.isLoop;
    }
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getCurrentTrack(): Playlist {
    return this.playlist[this.currentTrackIndex];
  }
}
