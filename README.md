# Software Factory

Yerel Codex/Plus üzerinde üç CTO kararıyla ürün geliştirme: yatırım, geliştirme kapsamı, yayın. GitHub Issues iş kaynağı; Projects görünüm. Aynı anda tek aktif geliştirme paketi. Son merge/yayın kullanıcıda.

## Durum — 5 Ekim 2026

Çekirdek yerel olarak hazır: üç ürün/beş repo kaydı, onay ve kanıt doğrulayıcıları, gerçek RTK komut kaydı, üç rol, beş teslim şablonu, native izin probe aracı ve heartbeat metni. Bağımsız inceleme sonrası 21 çekirdek testi geçti. Disposable pilotta önce iki davranış testi kırıldı; düzeltmeden sonra üç test geçti.

**Gözetimsiz geliştirme kapalı.** Native izin/sahiplik/araç sınırları, gerçek GitHub Issue/PR yazımı, pano ve zamanlanmış devam kabulü tamamlanmadı. Dosyaların bulunması bunların çalıştığı anlamına gelmez. Ayrıntılı [kabul kaydı](verification/acceptance.md).

## Klasörler ve dal

Codex'e eklenen ana proje: `C:/Users/tokso/source/repos/AI-Software-Factory`.
Kurulum çalışma kopyası: `C:/Users/tokso/source/repos/AI-Software-Factory-bootstrap`, dal `factory/bootstrap-a-plus`.

Bootstrap klasörü aynı Git reposunun ayrı worktree'sidir; kurulum değişiklikleri burada incelenir. İkinci uygulama veya çalışma servisi değildir. Ana checkout başlangıç `main` commit'inde kalır. Remote sınırlar doğrulanmadan push/PR ve kullanıcı yayın kararı olmadan merge yapılmaz.

Yerel pilot: `work/acceptance-product`, `factory/pilot-acceptance` dalı. Yalnızca iki pilot dosyası değişti; native worker veya canlı pilot PR olarak sunulmaz. `work/` ve `verification/runs/` Git'e eklenmez.

## Kullanım sözleşmesi

Yeni fikir [intake](templates/intake.md) → [araştırma/CTO 1](templates/research.md). Masa başı araştırma kullanım/ödeme isteğini doğrulamaz; gözlenmediyse UNKNOWN.

Mevcut iş: gerçek repo incelemesi → [tasarım/CTO 2](templates/work-package.md) → onaylı kapsamda plan/kod/test → bağımsız inceleme → [yayın/CTO 3](templates/release.md). Gate 2 sonrasında rutin plan onayı açılmaz; kapsam değişirse insan kararı gerekir. [Checkpoint](templates/checkpoint.md) aynı Issue'da sayaç/branch/SHA/PR/nextStep taşır.

[Policy](factory-policy.md), [skill](.agents/skills/factory/SKILL.md) ve [registry](projects.json) tek işletim sözleşmesidir. Product code/CI değişikliği bu kurulumda yok. Registry'deki unverified/null/boş kontroller onboarding bekler; Ready sayılmaz. Eventory gerçek brief'i henüz kayıtlı değil.

## Yerel doğrulama

```powershell
rtk proxy node --test verification/contracts.test.mjs verification/record-check.test.mjs verification/native-probes.test.mjs
rtk proxy node verification/contracts.mjs --registry projects.json
rtk proxy git diff --check
```

Tek onaylı komutun gerçek kanıtı için `rtk proxy node verification/record-check.mjs --input work/check-input.json`; girdi checkId, issue, packageVersion, repository, cwd, args, outputDirectory, timeoutMs taşır. args executable rtk'nin argümanlarıdır, örneğin `["proxy","node","--test"]`. Kayıt yetki vermez; dirty checkout/SHA değişikliği başarısız kanıttır. Native profil ve gerçek insan provenance'ı ayrıca gerekir.

## Sonraki işletim adımı

5 Ekim 2026: Kullanıcının açık onayıyla Codex'in first-party `windowsSandbox/setupStart` çağrısı üzerinden `elevated` kurulum tamamlandı. Native bildirim `success: true`, hazırlık sorgusu `ready` döndürdü; Codex global Windows sandbox ayarı `elevated` olarak kaydedildi. Standart native workspace profiliyle ayrı disposable klasörde gerçek komut çalıştı, exit 0 döndürdü ve beklenen deneme dosyası oluştu; temel kurulum çalışma testi geçti.

Gözetimsiz çalışma kapalı. Proje profili yükleme hatası sürüyor; doğrudan verilen dar profil `elevated Windows sandbox requires effective :root read access` nedeniyle reddediliyor. Ayrı, sabit dummy dosya komutlarıyla yapılan Windows uyumluluk denemesi de `CreateProcessWithLogonW failed: 267` ile komut başlamadan durdu. Bu denemenin genel okuma tabanı Factory profillerine uygulanmadı; hiçbir dosya koruma testi geçilmiş sayılmadı. Önce komut başlatma ve profil uyumluluğu çözülmeli, ardından GitHub integration erişimi, native rol/skill keşfi ve gerçek pilot/schedule kabulü tamamlanmalı. [Kabul kaydı](verification/acceptance.md) ayrıntıları tutar. [Heartbeat](automation/heartbeat.md) metni hazır; etkin otomasyon oluşturulmadı.
