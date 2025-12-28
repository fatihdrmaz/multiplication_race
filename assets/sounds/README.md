# 🎵 Ses Dosyaları Kılavuzu

Bu klasör oyun için ses efektleri ve müzik dosyalarını içerir.

## 📂 Gerekli Ses Dosyaları

### 🎼 Müzik

**background-music.mp3** (Arka plan müziği)
- Tempo: 120-140 BPM
- Süre: 2-3 dakika (loop edilecek)
- Stil: Enerjik, pozitif, çocuk dostu
- Öneriler: Upbeat electronic, fun racing theme

**winning-music.mp3** (Kazanma müziği)
- Süre: 5-10 saniye
- Stil: Zafer, kutlama
- Öneriler: Victory fanfare, triumph theme

### 🔊 Ses Efektleri

**engine-sound.mp3** (Motor sesi)
- Süre: 1-2 saniye
- Stil: Araba motoru, vroom vroom!

**boost-sound.mp3** (Hızlanma sesi)
- Süre: 1 saniye
- Stil: Swoosh, hızlanma efekti

**correct-answer.mp3** (Doğru cevap)
- Süre: 1 saniye
- Stil: Pozitif ding, success chime

**wrong-answer.mp3** (Yanlış cevap)
- Süre: 1 saniye
- Stil: Komik buzz, silly boing (üzücü değil!)

**coin-collect.mp3** (Coin toplama)
- Süre: 0.5 saniye
- Stil: Parlak ding, coin pickup

**crowd-cheer.mp3** (Seyirci alkışı)
- Süre: 2-3 saniye
- Stil: Tezahürat, alkış sesleri

**countdown.mp3** (Sayaç sesi - opsiyonel)
- Süre: 1 saniye
- Stil: Beep, countdown tick

## 🎨 Ses Ekleme Yöntemi

### Yöntem 1: Ücretsiz Ses Kütüphaneleri

```
🌐 Önerilen Siteler:
├─ Freesound.org - Ücretsiz ses efektleri
├─ Incompetech.com - Royalty-free müzik
├─ Zapsplat.com - Ses efektleri
├─ Bensound.com - Ücretsiz müzik
└─ Pixabay.com - Ses ve müzik
```

### Yöntem 2: AI ile Ses Üretme

```
🤖 AI Araçları:
├─ Suno AI - Müzik üretme
├─ Loudly - AI müzik
└─ Epidemic Sound - Müzik kütüphanesi
```

### Yöntem 3: Kendin Yap!

```
📱 Uygulamalar:
├─ GarageBand (iOS/Mac) - Müzik yapma
├─ FL Studio Mobile - Müzik prodüksiyon
└─ Voice memos - Ses kaydetme
```

## 💻 Kod Entegrasyonu

Ses dosyalarını ekledikten sonra, `App.js`'de şu şekilde kullanılıyor:

```javascript
// Ses yükleme
const [sound, setSound] = useState();

const playSound = async (soundFile) => {
  const { sound } = await Audio.Sound.createAsync(
    require(`./assets/sounds/${soundFile}`)
  );
  setSound(sound);
  await sound.playAsync();
};

// Kullanım
playSound('boost-sound.mp3');
```

## 📏 Dosya Özellikleri

### Format
- **MP3** (önerilen)
- Veya **WAV** (daha yüksek kalite ama büyük dosya)
- Bitrate: 128-192 kbps (MP3)
- Sample Rate: 44.1 kHz

### Boyut
- Müzik: 1-3 MB
- Ses efektleri: 10-100 KB

## 🎵 Müzik Kullanım İpuçları

### Dinamik Müzik Sistemi

```javascript
// Yarış durumuna göre müzik hızı
if (opponentPosition > playerPosition + 20) {
  // Oyuncu geride - müziği hızlandır!
  sound.setRateAsync(1.2);
} else {
  sound.setRateAsync(1.0);
}
```

### Ses Seviyesi Ayarı

```javascript
// Arka plan müziği daha sessiz
backgroundMusic.setVolumeAsync(0.3);

// Ses efektleri daha yüksek
correctSound.setVolumeAsync(1.0);
```

## 🚀 Hızlı Başlangıç

Eğer hemen test etmek istiyorsan:

1. **Placeholder ses dosyaları kullan** - App çalışır ama sessiz olur
2. **Ses butonlarını kapat** - Geçici olarak sesli kısımları devre dışı bırak
3. **Ücretsiz sesler indir** - Yukarıdaki sitelerden hemen indir

## 🔇 Sessiz Mod

Uygulama ses dosyaları olmadan da çalışır! Sadece sessiz olur. 

Ses dosyalarını eklemek tamamen opsiyoneldir.

---

**İyi eğlenceler! 🎵🏎️**

