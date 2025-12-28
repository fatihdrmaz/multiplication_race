#!/bin/bash
# Vroom Oyunu Başlatma Scripti

echo "🏎️  Vroom - Çarpım Tablosu Yarışı başlatılıyor..."
echo ""

# Dosya limitini artır
ulimit -n 65536

# Dizine git
cd /Users/fatihdurmaz/expo-projects/vroom

# Cache'i temizle ve başlat
echo "📦 Cache temizleniyor..."
npx expo start --clear

