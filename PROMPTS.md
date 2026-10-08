# Промпты для генерации изображений

Формат всех изображений — **4:5, 1080×1350, JPG**. Кладём в `public/bloggers/<id>/`:

```
public/bloggers/lina/portrait.jpg   post-1.jpg … post-4.jpg
public/bloggers/mark/…
public/bloggers/eva/…
public/bloggers/david/…
```

Имена файлов совпадают с плейсхолдерами — после замены ничего в коде менять не нужно.

**Консистентность лица.** Сначала генерируем портрет, затем публикации с ним как референсом:
- Midjourney v7: `--oref <url портрета> --ow 100` (omni-reference);
- Flux: Kontext / PuLID с портретом как reference image.

**Против «мыла» и артефактов:** `--style raw` в MJ, детали кожи и плёнка в промпте, руки по возможности вне кадра или в простых позах; финальный апскейл с умеренной резкостью.

Общий хвост для Midjourney: `--ar 4:5 --style raw --v 7`
Для Flux: добавить `aspect ratio 4:5, photorealistic, high detail`, guidance ~3–3.5.

---

## Лина Рей · `lina` · Lifestyle, Лиссабон

**Портрет**
> Editorial lifestyle portrait of a 26-year-old woman with long wavy copper-red hair and natural freckles, soft genuine smile, wearing an oversized cream linen shirt, standing on a sunlit balcony in Lisbon Alfama with terracotta rooftops softly blurred behind, warm golden morning light, shot on Kodak Portra 400, 85mm lens, shallow depth of field, natural skin texture with visible pores, no makeup look, calm and warm mood, head and shoulders, centered composition, upper third headroom --ar 4:5 --style raw --v 7

**Публикации**
1. *Утро на балконе* — Same woman sitting on a small Lisbon balcony with a ceramic cup of coffee, wrought-iron railing, morning sun, linen shirt, candid moment looking at the street, film photography, warm tones --ar 4:5 --style raw
2. *Субботний рынок* — Close-up lifestyle shot of hands holding a paper bag with peonies and peaches at an outdoor farmers market, the same red-haired woman partially in frame, soft daylight, Portra film look --ar 4:5 --style raw
3. *Трамвай 28 на закате* — Yellow Lisbon tram 28 on a steep cobblestone street at golden hour, the same woman walking away from camera in a linen dress, warm sunset flare, cinematic film still --ar 4:5 --style raw
4. *Тихий вечер* — Cozy evening interior, the same woman reading a book on a linen sofa under a knitted blanket, candle light, warm lamp glow, quiet atmosphere, 35mm film grain --ar 4:5 --style raw

---

## Марк Левин · `mark` · Бизнес и IT, Тбилиси

**Портрет**
> Professional editorial portrait of a 31-year-old Slavic man with short ash-blond hair and neatly trimmed light stubble, thin titanium-frame glasses, confident calm expression, wearing a black merino turtleneck, minimalist concrete studio background, cool soft key light with subtle rim light, shot on Sony A7R V, 85mm, sharp eyes, realistic skin texture, tech founder aesthetic, head and shoulders --ar 4:5 --style raw --v 7

**Публикации**
1. *Рабочий стек* — Top-down flat lay on a dark walnut desk: laptop with abstract dashboard, mechanical keyboard, notebook with handwritten notes, black coffee, the same man's hands typing, cool daylight, minimal tech aesthetic --ar 4:5 --style raw
2. *Разбор кейса* — The same man standing at a glass whiteboard with growth charts and arrows, explaining with a marker, modern office with city view, natural window light, candid documentary style --ar 4:5 --style raw
3. *Рабочее место* — Minimalist workspace with a single monitor and desk lamp, the same man in a black turtleneck focused on the screen, evening blue hour light from the window, Tbilisi rooftops outside, moody cinematic --ar 4:5 --style raw
4. *Питч-дек* — The same man presenting on stage at a small tech meetup, slide with bold numbers behind him blurred, audience silhouettes in foreground, stage spotlight, event photography --ar 4:5 --style raw

---

## Ева Ли · `eva` · Fashion, Париж

**Портрет**
> High-fashion editorial portrait of a 24-year-old East Asian woman with a sharp glossy black bob haircut with blunt bangs, graphic black eyeliner, bold confident gaze, wearing a structured black oversized blazer, pure monochrome studio background, hard directional light with deep shadows, Vogue editorial style, shot on medium format Hasselblad, 80mm, crisp detail, realistic skin texture, head and shoulders --ar 4:5 --style raw --v 7

**Публикации**
1. *Paris FW, образ дня* — Street style photo of the same woman walking past a Haussmann building in Paris during fashion week, long oversized charcoal coat, black boots, motion, photographers blurred in background, overcast light --ar 4:5 --style raw
2. *Чёрный — не скучно* — Close-up fashion detail: the same woman in an all-black outfit mixing leather, wool and satin textures, hard sunlight and sharp shadows on a white wall, editorial --ar 4:5 --style raw
3. *Бэкстейдж* — Backstage at a fashion show, the same woman among clothing racks and makeup lights, candid moment adjusting her blazer, mirror reflections, flash photography, grainy --ar 4:5 --style raw
4. *Капсула на неделю* — Flat lay of a minimalist capsule wardrobe of 7 pieces in black, chocolate brown and white on a concrete floor, shot from above, editorial styling, soft shadows --ar 4:5 --style raw

---

## Давид Арвели · `david` · Спорт и путешествия

**Портрет**
> Outdoor adventure portrait of a 29-year-old man with olive tanned skin, dark curly hair and a full short dark beard, warm wide smile, wearing a technical orange shell jacket, mountain ridge and clouds behind him, wind in hair, natural late-afternoon sunlight, shot on Canon R5, 50mm, realistic skin texture with sun-kissed details, adventurous energetic mood, head and shoulders --ar 4:5 --style raw --v 7

**Публикации**
1. *Рассвет на 4100* — The same man standing on a snowy Caucasus mountain ridge at sunrise, back half-turned to camera, pink and gold sky, breath visible in cold air, epic wide shot, Patagonia catalog style --ar 4:5 --style raw
2. *Первая волна* — The same man surfing a clean wave in Ericeira, Portugal, wetsuit, spray of water, low sun backlight, action sports photography, fast shutter --ar 4:5 --style raw
3. *120 км трейла* — The same man trail running on a rocky mountain path, dust and motion, running vest, dramatic valley behind, golden hour, sports editorial --ar 4:5 --style raw
4. *Палатка с видом* — Orange tent pitched on an alpine meadow above a valley at dusk, the same man sitting at the entrance with a metal mug, headlamp glow, first stars in the sky --ar 4:5 --style raw
