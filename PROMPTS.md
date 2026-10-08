# Промпты для генерации изображений (Google Gemini)

Генерация в [Gemini](https://gemini.google.com) или [Google AI Studio](https://aistudio.google.com), бесплатно с Google-аккаунтом. Промпты на английском: так модель точнее следует деталям.

## Как работать

1. **Сначала портрет.** Вставь промпт портрета и перегенерируй, пока лицо не будет чистым: без лишних пальцев, кривых глаз и «пластиковой» кожи. Это главный критерий оценки.
2. **Потом публикации с этим же лицом.** Для каждого поста прикрепи готовый портрет как картинку и вставь промпт поста. Промпты постов уже начинаются с фразы, что нужен тот же человек, что на фото.
3. **Если лицо «уплыло»**, допиши: `Keep the face identical to the reference photo: same eyes, nose, jaw, skin texture.`
4. **Если вышло «мыльно» или слишком гладко**, допиши: `Sharper detail, natural skin pores, no beauty filter, no airbrushing.`
5. **Пропорции не важны.** Я сам обрежу до 4:5 (1080×1350) и сожму.

Складывай файлы в папку `raw/` в корне проекта (её нет в git) с такими именами:

```
raw/lina-portrait.png   raw/lina-1.png … raw/lina-4.png
raw/mark-portrait.png   raw/mark-1.png … raw/mark-4.png
raw/eva-portrait.png    raw/eva-1.png  … raw/eva-4.png
raw/david-portrait.png  raw/david-1.png … raw/david-4.png
```

Если лимит не позволяет сделать все 20 картинок, сначала нужны 4 портрета: они видны везде. Постов можно сделать по 2 на персонажа.

---

## Лина Рей · `lina` · Lifestyle, Лиссабон

**Портрет**
> A photorealistic editorial lifestyle portrait photo of a 26-year-old woman with long wavy copper-red hair and natural freckles, a soft genuine smile, wearing an oversized cream linen shirt with a pale lavender scarf. She stands on a sunlit balcony in Lisbon's Alfama district, terracotta rooftops softly blurred behind her. Warm golden morning light, shot on Kodak Portra 400 film, 85mm lens, shallow depth of field. Natural skin texture with visible pores, no-makeup look. Head and shoulders, centered, some headroom above. Vertical 4:5 format. Real photograph, not an illustration.

**Публикации** (к каждому прикрепи портрет Лины)
1. *Утро на балконе*
   > Same woman as in the reference photo. She sits on a small Lisbon balcony with a ceramic cup of coffee, wrought-iron railing, morning sun, linen shirt, a candid moment looking down at the street. Film photography, warm tones. Vertical 4:5 photo, photorealistic.
2. *Субботний рынок*
   > Same woman as in the reference photo. A close-up lifestyle shot of her hands holding a paper bag with peonies and peaches at an outdoor farmers market, her face partially in frame and smiling. Soft daylight, Portra film look. Vertical 4:5 photo, photorealistic.
3. *Трамвай 28 на закате*
   > Same woman as in the reference photo. The yellow Lisbon tram 28 on a steep cobblestone street at golden hour, she walks along the street in a linen dress, looking back over her shoulder at the camera. Warm sunset flare, cinematic film still. Vertical 4:5 photo, photorealistic.
4. *Тихий вечер*
   > Same woman as in the reference photo. A cozy evening interior: she reads a book on a linen sofa under a knitted blanket, candle light and a warm lamp glow, quiet atmosphere, 35mm film grain. Vertical 4:5 photo, photorealistic.

---

## Марк Левин · `mark` · Бизнес и IT, Тбилиси

**Портрет**
> A photorealistic professional editorial portrait photo of a 31-year-old Slavic man with short ash-blond hair, neatly trimmed light stubble and thin titanium-frame glasses, with a confident, calm expression. He wears a black merino turtleneck. Minimalist concrete studio background, cool soft key light with a subtle rim light. Shot on Sony A7R V, 85mm, sharp eyes, realistic skin texture, tech founder look. Head and shoulders, centered. Vertical 4:5 format. Real photograph, not an illustration.

**Публикации** (к каждому прикрепи портрет Марка)
1. *Рабочий стек*
   > Same man as in the reference photo. A top-down flat lay on a dark walnut desk: a laptop with an abstract analytics dashboard, a mechanical keyboard, a notebook with handwritten notes, black coffee; his hands typing, his face visible at the edge of the frame. Cool daylight, minimal tech aesthetic. Vertical 4:5 photo, photorealistic.
2. *Разбор кейса*
   > Same man as in the reference photo. He stands at a glass whiteboard with growth charts and arrows, explaining something with a marker. Modern office with a city view, natural window light, candid documentary style. Vertical 4:5 photo, photorealistic.
3. *Рабочее место*
   > Same man as in the reference photo. A minimalist workspace with a single monitor and a desk lamp, he is focused on the screen in his black turtleneck. Evening blue-hour light from the window, Tbilisi rooftops outside, moody cinematic look. Vertical 4:5 photo, photorealistic.
4. *Питч-дек*
   > Same man as in the reference photo. He presents on stage at a small tech meetup, a slide with bold numbers blurred behind him, audience silhouettes in the foreground, stage spotlight, event photography. Vertical 4:5 photo, photorealistic.

---

## Ева Ли · `eva` · Fashion, Париж

**Портрет**
> A photorealistic high-fashion editorial portrait photo of a 24-year-old East Asian woman with a sharp glossy black bob haircut with blunt bangs, graphic black eyeliner and a bold, confident gaze. She wears a structured black oversized blazer. Pure monochrome studio background, hard directional light with deep shadows, Vogue editorial style. Shot on medium-format Hasselblad, 80mm, crisp detail, realistic skin texture. Head and shoulders. Vertical 4:5 format. Real photograph, not an illustration.

**Публикации** (к каждому прикрепи портрет Евы)
1. *Paris FW, образ дня*
   > Same woman as in the reference photo. A street-style photo of her walking past a Haussmann building in Paris during fashion week, in a long oversized charcoal coat and black boots, in motion, photographers blurred in the background, overcast light. Vertical 4:5 photo, photorealistic.
2. *Чёрный — не скучно*
   > Same woman as in the reference photo. A fashion detail shot of her in an all-black outfit mixing leather, wool and satin textures, hard sunlight and sharp shadows on a white wall, editorial look. Vertical 4:5 photo, photorealistic.
3. *Бэкстейдж*
   > Same woman as in the reference photo. Backstage at a fashion show among clothing racks and makeup lights, a candid moment adjusting her blazer, mirror reflections, direct flash, slight grain. Vertical 4:5 photo, photorealistic.
4. *Капсула на неделю*
   > A flat lay of a minimalist capsule wardrobe of 7 pieces in black, chocolate brown and white on a concrete floor, shot from directly above, editorial styling, soft shadows. Vertical 4:5 photo, photorealistic. (Человек здесь не нужен, референс можно не прикреплять.)

---

## Давид Арвели · `david` · Спорт и путешествия

**Портрет**
> A photorealistic outdoor adventure portrait photo of a 29-year-old man with olive tanned skin, dark curly hair, a full short dark beard and a warm wide smile. He wears a technical orange shell jacket. A mountain ridge and clouds behind him, wind in his hair, natural late-afternoon sunlight. Shot on Canon R5, 50mm, realistic skin texture with sun-kissed details, adventurous, energetic mood. Head and shoulders, centered. Vertical 4:5 format. Real photograph, not an illustration.

**Публикации** (к каждому прикрепи портрет Давида)
1. *Рассвет на 4100*
   > Same man as in the reference photo. He stands on a snowy Caucasus mountain ridge at sunrise, half-turned towards the camera so his face is visible, pink and gold sky, breath visible in the cold air, epic wide shot, outdoor catalog style. Vertical 4:5 photo, photorealistic.
2. *Первая волна*
   > Same man as in the reference photo. He surfs a clean wave in Ericeira, Portugal, in a wetsuit, spray of water, low sun backlight, action sports photography, fast shutter. Vertical 4:5 photo, photorealistic.
3. *120 км трейла*
   > Same man as in the reference photo. He runs along a rocky mountain trail, dust and motion, running vest, a dramatic valley behind him, golden hour, sports editorial. Vertical 4:5 photo, photorealistic.
4. *Палатка с видом*
   > Same man as in the reference photo. An orange tent pitched on an alpine meadow above a valley at dusk, he sits at the entrance holding a metal mug, headlamp glow, first stars in the sky. Vertical 4:5 photo, photorealistic.
