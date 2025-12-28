# 🎮 Vroom - Hot Wheels Çarpım Yarışı

## 🚗 Oyun Hakkında

Çocuklar için eğlenceli Hot Wheels tarzı bir çarpım tablosu öğretme oyunu! Doğru cevapları vererek arabayı hızlandır, rakibi geç ve yarışı kazan!

## ✨ Ana Özellikler

### 🏎️ Hot Wheels Araba Koleksiyonu
- **6 farklı araba** (Speed Demon, Blue Lightning, Nitro Beast, Turbo King, Shadow Racer, Mega Monster)
- Her araba farklı renk ve hız özelliğine sahip
- Coinlerle yeni arabalar aç
- Gerçekçi araba tasarımı: tekerlek, kabin, spoiler

### 👤 Kullanıcı Sistemi
- Kendi adınla kayıt ol
- Coin topla ve kaydet
- İlerlemeniz otomatik saklanır (AsyncStorage)
- Açtığın arabalar kalıcı

### 🏆 Leaderboard (Sıralama Tablosu)
- En iyi 10 pilot
- Gerçek zamanlı sıralama
- Madalya sistemi (🥇🥈🥉)
- Arkadaşlarınla yarış

### 🎨 Görsel Zenginlik
- Hot Wheels tarzı renkli arabalar
- Animasyonlu tekerlekler (360° dönüş)
- Hareket eden bulutlar ve ağaçlar
- Dalga yapan seyirciler
- Boost alevleri ve kıvılcımlar
- Gerçekçi pist tasarımı

### 🎮 3 Oyun Ekranı
1. **Hoşgeldin**: Kullanıcı adı gir, leaderboard gör
2. **Araba Seçimi**: 6 arabadan birini seç, yeni arabalar aç
3. **Yarış**: Çarpım sorularını çöz, yarışı kazan!

### 🎵 Ses Sistemi (Hazır)
- Arka plan müziği
- Motor sesleri
- Boost efektleri
- Doğru/yanlış cevap sesleri
- *(Ses dosyalarını `assets/sounds/` klasörüne ekle)*

### 📊 İlerleme Sistemi
- Seviye atlama
- Puan ve coin toplama
- Kombo bonusu (ard arda doğrular)
- Artan zorluk

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npx expo start

# Veya hızlı başlat
./start.sh
```

## 🎯 Nasıl Oynanır?

1. **Adını Yaz** - İlk ekranda kullanıcı adını gir
2. **Araba Seç** - 6 Hot Wheels arabasından birini seç
3. **Çöz ve Hızlan** - Çarpım sorularını doğru çöz
4. **Yarış Kazan** - Finişe ilk ulaş!
5. **Coin Topla** - Yeni arabalar aç
6. **Lider Ol** - Leaderboard'da zirveye çık!

## 🏁 Araba Koleksiyonu

| Araba | Hız | Fiyat | Renk |
|-------|-----|-------|------|
| 🏎️ Speed Demon | 5 | Ücretsiz | Kırmızı |
| 🚗 Blue Lightning | 6 | 50 coin | Mavi |
| 🏁 Nitro Beast | 7 | 100 coin | Yeşil |
| 🚙 Turbo King | 8 | 200 coin | Altın |
| 🚕 Shadow Racer | 9 | 300 coin | Mor |
| 🚚 Mega Monster | 10 | 500 coin | Pembe |

## 📱 Platform Desteği

- ✅ iOS (iPhone, iPad)
- ✅ Android (Telefon, Tablet)
- ✅ Web (Tarayıcı)

## 🎨 Teknik Özellikler

- **React Native** + **Expo**
- **AsyncStorage** - Veri saklama
- **Expo AV** - Ses sistemi (hazır)
- **Linear Gradient** - Renkli efektler
- **Reanimated** - Smooth animasyonlar

## 🎵 Ses Dosyaları Ekleme

Ses dosyalarını `assets/sounds/` klasörüne ekle:

```
assets/sounds/
├── background-music.mp3
├── boost-sound.mp3
├── correct-answer.mp3
├── wrong-answer.mp3
├── coin-collect.mp3
└── crowd-cheer.mp3
```

Detaylı bilgi için: `assets/sounds/README.md`

## 📚 Eğitsel Değer

- Çarpım tablosu öğretimi (2-10 arası)
- Hızlı düşünme becerisi
- Problem çözme yeteneği
- Motivasyon ve özgüven
- Rekabet ve hedef belirleme
- Strateji geliştirme (coin yönetimi)

## 🏆 Puan Sistemi

```
Doğru Cevap: +10 puan + 1 coin
Kombo x2: +15 puan ekstra
Kombo x3+: +20 puan ekstra
Yarış Kazanma: +100 puan + 5+ coin
Seviye Bonusu: Her seviye ekstra puan ve coin
```

## 📖 Dokümantasyon

- `README.md` - Bu dosya (genel bilgi)
- `QUICKSTART.md` - Hızlı başlangıç kılavuzu
- `HOT_WHEELS_FEATURES.md` - Detaylı özellik listesi
- `TROUBLESHOOTING.md` - Sorun giderme
- `FUTURE_FEATURES.md` - Gelecek özellikler
- `CHANGELOG.md` - Versiyon değişiklikleri

## 🔧 Sorun Giderme

### "EMFILE: too many open files"
```bash
ulimit -n 65536
```

### "Metro bundler dondu"
```bash
npx expo start --clear
```

### "Paketler güncel değil"
```bash
rm -rf node_modules
npm install
```

Detaylı çözümler için: `TROUBLESHOOTING.md`

## 🎯 Hedef Kitle

- **Yaş**: 6-10 yaş arası çocuklar
- **Amaç**: Çarpım tablosu öğretimi
- **Yaklaşım**: Oyunlaştırma (gamification)
- **Deneyim**: Eğlenceli, motive edici, ödüllendirici

## 🌟 Öne Çıkan Özellikler

1. **Hot Wheels Teması** - Gerçek araba koleksiyonu hissi
2. **Kullanıcı Profili** - Kişiselleştirilmiş deneyim
3. **Leaderboard** - Sosyal rekabet
4. **Araba Koleksiyonu** - Uzun vadeli hedef
5. **Gerçekçi Grafikler** - Detaylı animasyonlar
6. **Coin Sistemi** - Ekonomi ve strateji
7. **İlerleme Takibi** - Motivasyon
8. **Mobil Uyumlu** - Her cihazda çalışır

## 🚀 Başlat ve Oyna!

```bash
# Hızlı başlat
./start.sh

# veya
npx expo start

# Web'de test et
w tuşuna bas

# iOS Simulator
i tuşuna bas

# Android Emulator
a tuşuna bas
```

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır. Katkılarınızı bekliyoruz!

## 📄 Lisans

MIT License

## 💬 İletişim

Sorularınız ve önerileriniz için issue açabilirsiniz.

---

## 🎊 Versiyon Geçmişi

### v3.0 - Hot Wheels Edition (Son)
- ✅ 6 Hot Wheels arabası
- ✅ Kullanıcı sistemi
- ✅ Leaderboard
- ✅ Araba seçim ekranı
- ✅ Detaylı araba grafikleri
- ✅ Gerçekçi pist
- ✅ Ses sistemi altyapısı

### v2.0 - Monster Truck Edition
- ✅ Yatay yarış sistemi
- ✅ Monster truck arabalar
- ✅ Animasyonlu tekerlekler
- ✅ Seyirci animasyonları

### v1.0 - İlk Versiyon
- ✅ Temel yarış mekaniği
- ✅ Çarpım soruları
- ✅ Puan sistemi

---

**🏎️ Hadi yarışalım! Matematik öğrenmek hiç bu kadar eğlenceli olmamıştı! 💨**

*Made with ❤️ for kids who love racing and learning!*
