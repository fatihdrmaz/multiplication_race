# 🎮 Vroom - Hızlı Başlangıç Kılavuzu

## ✅ Kurulum Tamamlandı!

Oyun başarıyla kuruldu ve çalışmaya hazır!

## 🚀 Nasıl Çalıştırılır?

### Yöntem 1: Hızlı Başlatma (Önerilen)
```bash
./start.sh
```

### Yöntem 2: Manuel Başlatma
```bash
cd /Users/fatihdurmaz/expo-projects/vroom
ulimit -n 65536
npx expo start
```

### Yöntem 3: Web Sürümü
```bash
npx expo start --web
```

## 📱 Mobil Cihazda Test

1. **Expo Go İndir**:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **QR Kodu Tara**:
   - Terminal'de görünen QR kodu Expo Go uygulamasıyla tara
   - Veya terminalde `i` (iOS) veya `a` (Android) tuşuna bas

3. **Oyna!** 🏎️

## 💻 Web Tarayıcıda Test

Terminal açıkken `w` tuşuna bas → otomatik olarak tarayıcıda açılır!

## 🎯 Oyun Nasıl Oynanır?

1. **Yarış Başlar**: Sen ve rakip araba pistte!
2. **Soru Gelir**: Ekranda bir çarpım sorusu görünür (örn: 7 × 8 = ?)
3. **Doğru Cevabı Seç**: Üç seçenekten birini tıkla
4. **Hızlan**: ✅ Doğru = İleri, ❌ Yanlış = Yavaşla
5. **Kazan**: Finişe ilk ulaş!

## 🏆 Özellikler

- 🎨 **Renkli Tasarım**: Çocuklar için eğlenceli
- 📱 **Mobil Uyumlu**: Her cihazda mükemmel
- 🎓 **Eğitsel**: Çarpım tablosu öğretir
- 🏅 **Ödüller**: Puan ve coin sistemi
- 🔥 **Combo Bonusu**: Ard arda doğrular ekstra puan
- ⭐ **Seviye Sistemi**: Artan zorluk

## 🛠️ Kurulu Paketler

- ✅ Expo SDK 51.0.0
- ✅ React Native 0.74.5
- ✅ React Native Web
- ✅ Linear Gradient
- ✅ Reanimated
- ✅ Watchman (dosya izleme)

## 🔧 Yardımcı Komutlar

```bash
# Sunucuyu başlat
npx expo start

# Cache'i temizle
npx expo start --clear

# Web'de aç
npx expo start --web

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Proje durumunu kontrol et
npx expo doctor
```

## 📂 Proje Yapısı

```
vroom/
├── App.js                 # 🎮 Ana oyun kodu
├── package.json          # 📦 Bağımlılıklar
├── app.json              # ⚙️  Expo ayarları
├── start.sh              # 🚀 Başlatma scripti
├── README.md             # 📖 Ana dokümantasyon
├── TROUBLESHOOTING.md    # 🔧 Sorun giderme
├── FUTURE_FEATURES.md    # 💡 Gelecek özellikler
└── assets/               # 🎨 Görseller
    └── README.md         # İkon tasarım notları
```

## ⚠️ Sorun mu Yaşıyorsun?

**EMFILE: too many open files**
```bash
ulimit -n 65536
```

**Metro Bundler dondu**
```bash
npx expo start --clear
```

**Paketler güncel değil**
```bash
rm -rf node_modules
npm install
```

Daha fazla için → `TROUBLESHOOTING.md`

## 🎨 Görselleri Özelleştir

`assets/README.md` dosyasında AI prompt'ları var. Kendi görsellerini oluştur!

## 📞 Yardım

Sorun mu var? 
1. `TROUBLESHOOTING.md` dosyasına bak
2. Terminal'de hata mesajını oku
3. `npx expo doctor` çalıştır

## 🎉 Şimdi Oynama Zamanı!

Terminalini kontrol et, QR kodu tara ve yarışa başla! 🏎️💨

---

**Kolay gelsin! İyi eğlenceler! 🚀📚**

