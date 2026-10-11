# AI Software Factory

ChronoPlan ve WhisperRoom gibi mevcut ürünleri, Eventory gibi yeni fikirleri tek çalışma düzeninde yöneten yerel Codex projesi. Amaç geliştirme yükünü ve projeler arasındaki bağlam değişimini azaltmak. Araştırma, planlama, uygulama ve inceleme rollerini Codex yürütür; yatırım, geliştirme kapsamı ve yayın kararları CTO olarak kullanıcıda kalır.

Bu repo mevcut Codex/Plus kullanımına göre hazırlanmıştır. Ayrı bir ücretli API servisi veya sürekli çalışan sunucu kurulumu içermez.

## Codex'te nasıl başlatılır?

1. Codex'te `C:/Users/tokso/source/repos/AI-Software-Factory` klasörüne bağlı Software Factory projesini aç.
2. Projede **yeni bir sohbet** başlat. Mevcut sohbetlerin skill listesi kurulum öncesinden kalabilir.
3. İlk mesajı gönder:

```text
$factory durum
```

Codex, [Factory skill](.agents/skills/factory/SKILL.md), [işletim kuralları](factory-policy.md), [proje kayıtları](projects.json) ve [kabul kaydını](verification/acceptance.md) okuyarak mevcut durumu, eksik yetenekleri ve sonraki insan kararını raporlar. Bu çağrı ürün kodunu değiştirmez veya worker başlatmaz. İlk durum raporu için GitHub Issue gerekmez.

Skill seçicide `factory` görünmüyorsa projeyi yeniden aç veya Codex'i yeniden başlat. Klasörün `.agents/skills/factory/SKILL.md` dosyasını içerdiğini kontrol et. İlk tanılama için şu açık dosya talimatı da kullanılabilir:

```text
.agents/skills/factory/SKILL.md dosyasını oku ve yalnızca Factory durumunu raporla.
```

### Yeni fikir

```text
$factory Eventory fikrini araştırma aşamasına al. Önce ihtiyacı,
hedef kullanıcıyı ve kanıt eksiklerini belirleyelim.
```

İlk çıktı sohbet içinde bir [intake taslağı](templates/intake.md) olur; eksik niyet için tek soru sorulur. Kaydedilmiş iş ve geliştirme yetkisi oluşturulmaz. Araştırma `FACT`, `INFERENCE`, `ASSUMPTION`, `UNKNOWN` ayrımını korur. Masa başı araştırma gerçek kullanım veya ödeme isteğini kanıtlamaz. Kanıtlanmayan talep `UNKNOWN` kalır; yatırım kararı kullanıcıya gelir.

### Mevcut ürün

```text
$factory ChronoPlan'daki yeni iş talebimi değerlendir.
Önce ilgili repo ve mevcut davranışı incele, geliştirme kapsamını hazırla.
```

İlk değerlendirme ve kapsam taslağı sohbet içinde hazırlanabilir. Yönetilen uygulama için GitHub Issue, sürümlü iş paketi, kapsam özeti, gerçek insan onayı ve ilgili kabul kontrolleri gerekir. Kayıtlı repoların bulunması onların geliştirmeye hazır olduğu anlamına gelmez.

## Kurulan skill ve roller

| Dosya | Görev |
|---|---|
| [AGENTS.md](AGENTS.md) | Repo içindeki ortak çalışma talimatları ve giriş yolu |
| [.agents/skills/factory/SKILL.md](.agents/skills/factory/SKILL.md) | `$factory` çağrısı, durum/intake ve yönetilen iş akışı |
| [.codex/agents/factory-planner.toml](.codex/agents/factory-planner.toml) | Araştırma, tasarım ve CTO karar paketi |
| [.codex/agents/factory-implementer.toml](.codex/agents/factory-implementer.toml) | Onaylı, bağlı iş paketinin uygulama rolü; başlangıç izni salt okunur |
| [.codex/agents/factory-reviewer.toml](.codex/agents/factory-reviewer.toml) | Bağımsız inceleme ve kanıt denetimi |
| [.codex/config.toml](.codex/config.toml) | Projeye özel izin profilleri ve araç kısıtları |

Roller ayrı sohbetlerde elle çalıştırılacak servisler değildir. Koordinatör, uygun iş paketinde rol devri yapar. Dosya tanımlarının kurulması gerçek agent çağrısı, iş sahipliği ve güvenlik kabulünü tek başına kanıtlamaz; bu kontroller [kabul kaydında](verification/acceptance.md) ayrı tutulur.

Skill kendi dosyasının bulunduğu repoyu `FACTORY_ROOT` olarak çözümler. Ürün checkout'unda çalışan role bu kök açıkça aktarılır. Ürün kökü veya bootstrap klasörü otomatik varsayılmaz. Kurulum repo kapsamındadır; bütün Codex projelerine global skill eklemez.

## Üç CTO kararı

| Karar | Kullanıcının onayladığı sonuç |
|---|---|
| CTO 1 — Yatırım | Araştırma, kanıt eksikleri ve doğrulama yaklaşımı |
| CTO 2 — Geliştirme | Tasarım, kapsam, kabul ölçütleri ve izin verilen değişiklikler |
| CTO 3 — Yayın | Doğrulanmış aday, kalan riskler ve merge/yayın kararı |

Akış: **Evidence → Decision → Execution → Measurement**. Aynı anda portföy genelinde tek aktif geliştirme paketi. Onaylı kapsam içindeki rutin işler tekrar plan onayı gerektirmez; kapsam veya önemli sınır değişirse insan kararı gerekir. Son merge ve yayın kullanıcıdadır.

GitHub Issues yönetilen iş kaynağıdır; Projects görünüm katmanıdır. [Checkpoint](templates/checkpoint.md), aynı Issue'da sürüm, kapsam, sayaç, branch, SHA, PR ve `nextStep` bilgisini taşır. [Araştırma](templates/research.md), [iş paketi](templates/work-package.md) ve [yayın](templates/release.md) şablonları kararları kısa ve incelenebilir tutar.

## Çalışan kısım ve açık sınırlar

Yerel çekirdek; proje kayıtlarını, onay ve kanıt sözleşmelerini, gerçek komut kayıtlarını ve izin probe akışını içerir. Durum/intake girişi kurulumun manuel başlangıcıdır.

**Gözetimsiz geliştirme henüz kabul edilmedi.** Yerel TCP/servis erişimi, gerçek agent rol seçimi, araç yüzeyi, iş sahipliği, native junction ve GitHub sınırları açık. Önceki GitHub Issue yazımı `403 — Resource not accessible by integration` döndürdü; Git push erişimi ayrı bir kanaldır. Gerçek pilot/PR, pano ve zamanlanmış devam kabulü tamamlanmadı. [Heartbeat](automation/heartbeat.md) talimatı hazır; bu dosya etkin otomasyon oluşturmaz.

Onaylı Windows A politikası genel okumayı kullanır; seçilen kimlik bilgisi ve kişisel klasörler açıkça yasaktır. Diğer yerel dosyalar okunabilir. `.env` yasakları başlangıçta altı dizin seviyesiyle taranır; daha derin veya sonradan oluşan dosyalar ayrıca değerlendirilir. Yerel yollar ve izin profilleri bu Windows makinesine göre hazırlanmıştır; başka makinede yeniden onboarding gerekir. Tarihli sonuçlar ve kalan kontroller [kabul kaydında](verification/acceptance.md) bulunur.

## Yerel doğrulama

Mevcut Node.js ve RTK kurulumu ile repo kökünde:

```powershell
rtk proxy node --test verification/contracts.test.mjs verification/record-check.test.mjs verification/native-probes.test.mjs
rtk proxy node verification/contracts.mjs --registry projects.json
rtk proxy git diff --check
```

Tek onaylı komutun gerçek kanıtı için `rtk proxy node verification/record-check.mjs --input work/check-input.json` kullanılır. Girdi `checkId`, `issue`, `packageVersion`, `repository`, `cwd`, `args`, `outputDirectory`, `timeoutMs` taşır. `args`, RTK argümanlarıdır; örneğin `["proxy","node","--test"]`. Kayıt tek başına yetki vermez. Dirty checkout veya SHA değişikliği başarısız kanıttır.

## Klasör düzeni

Ana kullanım klasörü `C:/Users/tokso/source/repos/AI-Software-Factory`, GitHub reposu [haliltokszz/Software-Factory](https://github.com/haliltokszz/Software-Factory).

`AI-Software-Factory-bootstrap`, aynı Git reposunun kurulum için kullanılmış ayrı worktree'sidir. İkinci uygulama veya çalışan servis değildir; günlük kullanım için ana proje yeterlidir. Kurulumun ana repo/main üzerine alınması ve GitHub'a gönderilmesi kullanıcı tarafından açıkça onaylanmıştır. Bu onay ürün yayın yetkisi oluşturmaz.

`.agent/` ve `.superpowers/` yerel çalışma bağlamını, `work/` deneme/iş dosyalarını, `verification/runs/` ham doğrulama kanıtlarını tutar. Bu klasörler Git'e eklenmez. Kalıcı işletim kuralları, şablonlar ve doğrulama kaynakları Git'te tutulur.
