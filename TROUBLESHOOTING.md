# Vroom - Sorun Giderme Kılavuzu 🔧

## ❌ Yaygın Hatalar ve Çözümleri

### 1. EMFILE: too many open files (macOS)

Bu hata, sistemin aynı anda açık tutabileceği dosya sayısı limitinden kaynaklanır.

#### Çözüm A: Watchman Kur (Önerilen) 🎯

```bash
# Homebrew ile watchman kur
brew install watchman

# Sonra projeyi yeniden başlat
npx expo start
```

#### Çözüm B: Dosya Limitini Artır

```bash
# Mevcut limiti kontrol et
ulimit -n

# Geçici olarak artır (terminal oturumu için)
ulimit -n 65536

# Sonra expo'yu başlat
npx expo start
```

#### Çözüm C: Kalıcı Çözüm (macOS)

```bash
# ~/.zshrc dosyanıza ekleyin
echo 'ulimit -n 65536' >> ~/.zshrc

# Terminali yeniden başlatın veya
source ~/.zshrc
```

---

### 2. React Native Versiyon Uyumsuzluğu

```bash
# Paketleri güncelle
npm install

# Eğer sorun devam ederse, node_modules'ü temizle
rm -rf node_modules
npm install
```

---

### 3. Metro Bundler Donması

```bash
# Cache'i temizle
npx expo start --clear

# Veya
npm start -- --reset-cache
```

---

### 4. iOS Simulator Açılmıyor

```bash
# Xcode Command Line Tools'u kontrol et
xcode-select --install

# Expo CLI'da 'i' tuşuna bas
```

---

### 5. Android Emulator Açılmıyor

```bash
# Android Studio'nun açık olduğundan emin ol
# Bir emulator başlat, sonra Expo CLI'da 'a' tuşuna bas
```

---

### 6. "Cannot find module" Hataları

```bash
# Tüm node_modules'ü temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install

# Expo cache'i de temizle
npx expo start --clear
```

---

### 7. "Unable to resolve module" Hatası

```bash
# Metro bundler'ı resetle
npx expo start --clear

# Veya watchman cache'ini temizle
watchman watch-del-all
```

---

## 🚀 Hızlı Başlatma Komutu

Tüm bu sorunları önlemek için:

```bash
#!/bin/bash
# start-vroom.sh

# Dosya limitini artır
ulimit -n 65536

# Cache'i temizle ve başlat
npx expo start --clear
```

Dosyaya çalıştırma izni ver:
```bash
chmod +x start-vroom.sh
./start-vroom.sh
```

---

## 📱 Cihazda Test Etme

### iOS (iPhone/iPad)
1. App Store'dan **Expo Go** indir
2. Terminal'deki QR kodu tara
3. Oyunu oyna!

### Android
1. Play Store'dan **Expo Go** indir
2. QR kodu tara
3. Oyunu oyna!

### Web
```bash
# Expo CLI'da 'w' tuşuna bas
# Veya
npx expo start --web
```

---

## 🔍 Debug İpuçları

### Console Logları
```javascript
// App.js içinde debug için
console.log('Oyuncu pozisyonu:', playerPosition);
console.log('Soru:', question);
```

### React Native Debugger
```bash
# Chrome DevTools
# Expo CLI'da 'j' tuşuna bas
```

### Performance İzleme
```bash
# Expo CLI'da 'm' tuşuna bas
# "Performance Monitor" seçeneğini aç
```

---

## 💡 Yardımcı Komutlar

```bash
# Expo sürümünü kontrol et
npx expo --version

# Proje bilgilerini göster
npx expo config

# Bağımlılıkları kontrol et
npx expo doctor

# Cache'i tamamen temizle
npx expo start --clear --reset-cache

# Tunnel ile başlat (firewall sorunu varsa)
npx expo start --tunnel
```

---

## 🆘 Yardım Alma

Sorun devam ediyorsa:

1. **Expo Docs**: https://docs.expo.dev
2. **Expo Discord**: https://discord.gg/expo
3. **Stack Overflow**: `expo` ve `react-native` tagları ile ara

---

## ✅ Başarılı Kurulum Kontrol Listesi

- [ ] Node.js kurulu (v16+)
- [ ] npm veya yarn çalışıyor
- [ ] Expo CLI kurulu (`npx expo --version`)
- [ ] Watchman kurulu (önerilen)
- [ ] `npm install` başarılı
- [ ] `npx expo start` çalışıyor
- [ ] QR kod görünüyor
- [ ] Telefonda Expo Go kurulu

Hepsi tamamsa, hazırsın! 🎉

