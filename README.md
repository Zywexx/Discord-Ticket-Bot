# Discord Ticket Bot - Açık Kaynak Destek Sistemi

## 📌 Bot Hakkında

Bu bot, Discord sunucuları için gelişmiş bir ticket (destek bileti) yönetim sistemi sunar. Kullanıcılar kolayca destek talebi oluşturabilir, yetkililer bu talepleri yönetebilir ve tüm süreç kayıt altına alınabilir.

## ✨ Özellikler

- **Çoklu Ticket Türleri**: Farklı destek türleri için özelleştirilebilir ticket seçenekleri
- **Gelişmiş Yetki Yönetimi**: Sadece yetkili rolüne sahip kişiler ticket'lara erişebilir
- **Otomatik Transkript**: Kapatılan ticket'ların HTML formatında kaydı
- **Kullanıcı Dostu Arayüz**: Kolay anlaşılır butonlar ve komutlar
- **Log Sistemi**: Tüm ticket işlemleri log kanalına kaydedilir

## 🛠 Kurulum

1. `config.json` dosyasını doldurun:
   - `token`: Bot tokeniniz
   - `clientId`: Bot client ID'niz
   - `parent`: Ticket kanallarının oluşturulacağı kategori ID'si
   - `roleStaffId`: Ticket'lara erişimi olan yetkili rolü ID'si
   - `logChannel`: Logların gönderileceği kanal ID'si

2. Gerekli paketleri yükleyin:
```bash
npm install discord.js discord-api-types @discordjs/rest discord-html-transcripts
```

3. Botu başlatın:
```bash
node index.js
```

## 📋 Komutlar

- `/ticket`: Ticket açma panelini gönderir (Sadece yöneticiler)
- `/ticket-kisi-ekle [kullanıcı]`: Ticket'a kullanıcı ekler
- `/ticket-kapat`: Ticket'ı kapatır
- `/transcript`: Ticket transkripti oluşturur

## 🎯 Kullanım

1. Yönetici `/ticket` komutunu kullanarak ticket panelini gönderir
2. Kullanıcılar paneldeki butonlardan birine basarak ticket açar
3. Yetkililer ticket'ları yönetir (kapatma, transkript oluşturma vb.)
4. Kapatılan ticket'lar otomatik olarak loglanır

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

**Not:** Bu bot [Zywexx](https://github.com/Zywexx) tarafından geliştirilmiştir. Sorularınız için Discord sunucusuna katılabilirsiniz: [discord.gg/YAEjW6drVY](https://discord.gg/YAEjW6drVY)
