# 🚀 Vercel Deployment Kılavuzu

## Vercel'e Deploy Etme

### Yöntem 1: Vercel CLI (Önerilen)

1. **Vercel CLI Kur**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deploy**
```bash
vercel --prod
```

---

### Yöntem 2: Vercel Dashboard (Kolay)

1. **https://vercel.com** adresine git
2. **"Add New Project"** tıkla
3. **"Import Git Repository"** seç
4. **GitHub hesabını bağla**
5. **multiplication_race** repository'sini seç

#### ⚙️ Build Settings:

```
Framework Preset: Other
Build Command: npx expo export -p web
Output Directory: dist
Install Command: npm install
```

#### 🔧 Environment Variables:
```
(Şu an gerekmiyor, ileride API key'ler için)
```

6. **"Deploy"** butonuna tıkla!

---

### Yöntem 3: GitHub Integration (Otomatik)

**Avantaj:** Her push otomatik deploy olur!

1. Vercel'de projeyi GitHub'dan import et
2. Otomatik deployment aktif olur
3. Her `git push` otomatik deploy tetikler

---

## 📋 Vercel Dashboard Ayarları

### Build & Development Settings

```json
{
  "framework": "Other",
  "buildCommand": "npx expo export -p web",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npx expo start --web"
}
```

### Root Directory
```
./
```

### Node.js Version
```
18.x (önerilen)
```

---

## 🎯 Proje Tipi Seçimi

Vercel'de sorarsa:

| Soru | Cevap |
|------|-------|
| Framework Preset | **Other** veya **Create React App** |
| Build Command | `npx expo export -p web` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## ✅ Deploy Sonrası

Deploy başarılı olduktan sonra:

### 1. Domain
```
https://multiplication-race.vercel.app
```

### 2. Preview URL'ler
Her branch için otomatik preview URL oluşur:
```
https://multiplication-race-git-feature.vercel.app
```

### 3. Analytics
Vercel Dashboard'da:
- Visitor sayısı
- Performance metrikleri
- Web Vitals

---

## 🔍 Test Etme

Deploy sonrası test et:

```bash
# Local test
npm run build:web
npx serve dist

# Production test
# Vercel URL'ini tarayıcıda aç
```

---

## 🐛 Sorun Giderme

### 1. Build Hatası
```bash
# Local'de test et
npm run build:web

# Hata varsa logları kontrol et
```

### 2. Blank Screen
- `app.json` web config kontrol et
- Console loglarını kontrol et (F12)
- AsyncStorage yerine localStorage kullan (web için)

### 3. Asset Yükleme Hatası
```json
// app.json
{
  "assetBundlePatterns": [
    "**/*"
  ]
}
```

---

## 🎨 Özelleştirme

### Custom Domain
Vercel Dashboard → Settings → Domains
```
multiplication-race.com
```

### Redirect Rules
vercel.json:
```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📊 Performance

### Web Vitals
Vercel otomatik ölçer:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- FID (First Input Delay)

### Optimization
```bash
# Expo web optimize
npx expo export -p web --clear
```

---

## 🔄 Otomatik Deploy

### GitHub Actions (Opsiyonel)
`.github/workflows/vercel.yml`:
```yaml
name: Vercel Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx expo export -p web
      - uses: amondnet/vercel-action@v20
```

---

## 📱 Mobil Support

Web versiyonu responsive:
- ✅ Mobile browsers
- ✅ Tablet browsers
- ✅ Desktop browsers

Ama native app değil! Native için:
- iOS: App Store
- Android: Play Store

---

## 🎯 Sonraki Adımlar

1. ✅ Vercel'e deploy et
2. ✅ Custom domain ekle (opsiyonel)
3. ✅ README'ye deploy badge ekle
4. ✅ SEO optimize et
5. ✅ Analytics ekle

---

## 🏆 Deploy Badge

README.md'ye ekle:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/fatihdrmaz/multiplication_race)

![Deployed on Vercel](https://vercelbadge.vercel.app/api/fatihdrmaz/multiplication_race)
```

---

## 📞 Yardım

- Vercel Docs: https://vercel.com/docs
- Expo Web: https://docs.expo.dev/guides/web/
- Issue: GitHub Issues

---

**🚀 Hadi deploy edelim!**

